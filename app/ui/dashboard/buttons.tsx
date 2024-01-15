'use client';

import { SyntheticEvent, useEffect, useState } from 'react';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { Booking, Room } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import '@/app/ui/dashboard/datePicker.css';
import DatePicker from 'react-date-picker';
import TimePicker from 'react-time-picker';

type DatevalPiece = Date | null;
type Dateval = DatevalPiece | [DatevalPiece, DatevalPiece];

type roomResult = {
  value: number,
  label: string,
}

type Errors = {
  name?: string,
  date?: string,
  time?: string,
  needs?: string,
  room?: string,
}

export function CreateBooking() {
  const [modal, setModal] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState<Dateval>(new Date());
  const [timeStart, setTimeStart] = useState(new Date());
  const [timeEnd, setTimeEnd] = useState(new Date);
  const [needs, setNeeds] = useState('');
  const [roomId, setRoomId] = useState<number>();
  const [isMutating, setIsMutating] = useState(false);
  const [roomData, setRoomData]= useState<roomResult[]>([]);
  const [errors, setErrors] = useState<Errors>({}); 
  const [isFormValid, setIsFormValid] = useState(false); 

  const router = useRouter();

  useEffect(() => {
    async function fetchRoomData() {
      const { data } = await axios.get("/api/rooms");
      const results = data.map((value: {id: number, name: string, location: string}) => ({
        value: value.id,
        label: `${value.location} - ${value.name}`,
      }));
      setRoomData(results);
    }
    fetchRoomData();
  }, []);
  useEffect(() => { 
    validateForm(); 
  }, [name, date, timeStart, timeEnd, needs, roomId]); 

  const validateForm = () => {
    let errors: Errors = {};

    if (!name) {
      errors.name = 'Name is required.'
    }
    if (!date) {
      errors.date = 'Date is required.'
    }
    if (!timeStart || !timeEnd) {
      errors.time = 'Time is required.'
    }
    if (!needs) {
      errors.needs = 'Needs is required.'
    }
    if (!roomId) {
      errors.room = 'Room is required'
    } else if (roomId < 1 || !roomData.some(item => item.value === roomId)) {
      errors.room = 'Room doesn\'t exist'
    }

    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  }

  async function handleSubmit(e:SyntheticEvent) {
    e.preventDefault();
    
    if (isFormValid) {
      setIsMutating(true);
      const strDate = date?.toLocaleString();
      var newDate = new Date(strDate!);
      newDate.setHours(0,0,0,0);
      const userTimezoneOffset = newDate.getTimezoneOffset() * 60000;
      newDate = new Date(newDate.getTime() - userTimezoneOffset);
      
      await axios.post("/api/bookings", {
        name: name,
        date: newDate,
        timeStart: timeStart,
        timeEnd: timeEnd,
        needs: needs,
        roomId: roomId,
      }).catch(function (error) {
        alert(error.response.data);
      });

      setIsMutating(false);
      setName('');
      setDate(new Date());
      setTimeStart(new Date());
      setTimeEnd(new Date());
      setNeeds('');
      setRoomId(undefined);
      router.refresh();
      setModal(false);
    } else {
      alert('Form is not valid');
    }
  }
  function handleChange() {
    setModal(!modal);
  }
  function setTime(strTime: string, isStart: boolean) {
    const arrTime = strTime.split(':');
    const date = new Date();
    date.setHours(parseInt(arrTime[0]));
    date.setMinutes(parseInt(arrTime[1]));
    date.setSeconds(0);
    date.setMilliseconds(0);
    if (isStart) {
      setTimeStart(date);
    } else {
      setTimeEnd(date);
    }
  }

  return (
    <div>
      <button
      onClick={handleChange}
      className="flex h-10 items-center rounded-lg bg-[#59A04C] px-4 text-sm font-medium text-white transition-colors hover:bg-[#59A04C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Book a Room</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </button>
      <input type="checkbox" checked={modal} onChange={handleChange} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Book a Room</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className='label font-bold'>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input w-full input-bordered"
                placeholder='Name'
              />
              {errors.name && <p className='text-error'>{errors.name}</p>}
              <label className='label font-bold'>Date</label>
              <DatePicker
                value={date}
                onChange={setDate}
                className="input w-full input-bordered"
                locale='en-US'
              />
              {errors.date && <p className='text-error'>{errors.date}</p>}
              <label className='label font-bold'>Time</label>
              <div className='flex justify-between items-center'>
                <TimePicker
                  value={timeStart}
                  onChange={(value) => setTime(value!.toString(), true)}
                  className="input w-[48%] input-bordered"
                  clearIcon={null}
                />
                -
                <TimePicker
                  value={timeEnd}
                  onChange={(value) => setTime(value!.toString(), false)}
                  className="input w-[48%] input-bordered"
                  clearIcon={null}
                />
              </div>
              {errors.time && <p className='text-error'>{errors.time}</p>}
              <label className='label font-bold'>Needs</label>
              <input
                type="text"
                value={needs}
                onChange={(e) => setNeeds(e.target.value)}
                className="input w-full input-bordered"
                placeholder='Needs'
              />
              {errors.needs && <p className='text-error'>{errors.needs}</p>}
              <label className='label font-bold'>Room</label>
              <select
                name='rooms'
                className="input w-full input-bordered"
                value={roomId}
                defaultValue={'DEFAULT'}
                onChange={(e) => setRoomId(Number(e.target.value))}>
                  <option value="DEFAULT" hidden>Select an Option</option>
                  {roomData.map((option) => {
                    return (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    )
                  })}
              </select>
              {errors.room && <p className='text-error'>{errors.room}</p>}
            </div>
            <div className="modal-action">
              <button type="button" className="btn" onClick={handleChange}>Close</button>
              {!isMutating ? (
                <button type="submit" className="btn btn-primary">Save</button>
              ) : (
                <button type="button" className="btn">
                  <span className="loading loading-spinner" />
                  Saving...
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function UpdateBooking(booking: Booking) {
  const [modal, setModal] = useState(false);
  const [name, setName] = useState(booking.name);
  const [date, setDate] = useState<Dateval>(booking.date);
  const [timeStart, setTimeStart] = useState(booking.timeStart);
  const [timeEnd, setTimeEnd] = useState(booking.timeEnd);
  const [needs, setNeeds] = useState(booking.needs);
  const [roomId, setRoomId] = useState(booking.roomId);
  const [isMutating, setIsMutating] = useState(false);
  const [roomData, setRoomData]= useState<roomResult[]>([]);
  const [errors, setErrors] = useState<Errors>({}); 
  const [isFormValid, setIsFormValid] = useState(false); 

  const router = useRouter();

  useEffect(() => {
    async function fetchRoomData() {
      const { data } = await axios.get("/api/rooms");
      const results = data.map((value: {id: number, name: string, location: string}) => ({
        value: value.id,
        label: `${value.location} - ${value.name}`,
      }));
      setRoomData(results);
    }
    fetchRoomData();
  }, []);
  useEffect(() => { 
    validateForm(); 
  }, [name, date, timeStart, timeEnd, needs]); 

  const validateForm = () => {
    let errors: Errors = {};

    if (!name) {
      errors.name = 'Name is required.'
    }
    if (!date) {
      errors.date = 'Date is required.'
    }
    if (!timeStart || !timeEnd) {
      errors.time = 'Time is required.'
    }
    if (!needs) {
      errors.needs = 'Needs is required.'
    }

    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  }

  async function handleUpdate(e:SyntheticEvent) {
    e.preventDefault();
    if (isFormValid) {
      setIsMutating(true);
      const strDate = date?.toLocaleString();
      var newDate = new Date(strDate!);
      newDate.setHours(0,0,0,0);
      const userTimezoneOffset = newDate.getTimezoneOffset() * 60000;
      newDate = new Date(newDate.getTime() - userTimezoneOffset);

      await axios.patch(`/api/bookings/${booking.id}`, {
        name: name,
        date: newDate,
        timeStart: timeStart,
        timeEnd: timeEnd,
        needs: needs,
        roomId: roomId,
      }).catch(function (error) {
        alert(error.response.data);
      })

      setIsMutating(false);
      router.refresh();
      setModal(false);
    } else {
      alert('Form is not valid!');
    }
  }
  function handleChange() {
    setModal(!modal);
  }
  function setTime(strTime: string, isStart: boolean) {
    const arrTime = strTime.split(':');
    const date = new Date();
    date.setHours(parseInt(arrTime[0]));
    date.setMinutes(parseInt(arrTime[1]));
    date.setSeconds(0);
    date.setMilliseconds(0);
    if (isStart) {
      setTimeStart(date);
    } else {
      setTimeEnd(date);
    }
  }

  return (
    <div>
      <button
      onClick={handleChange}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <span className="sr-only">Edit</span>
      <PencilIcon className="w-5" />
    </button>
      <input type="checkbox" checked={modal} onChange={handleChange} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit Booking #{booking.id}</h3>
          <form onSubmit={handleUpdate}>
          <div className="form-control">
              <label className='label font-bold'>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input w-full input-bordered"
                placeholder='Name'
              />
              {errors.name && <p className='text-error'>{errors.name}</p>}
              <label className='label font-bold'>Date</label>
              <DatePicker
                value={date}
                onChange={setDate}
                className="input w-full input-bordered"
              />
              {errors.date && <p className='text-error'>{errors.date}</p>}
              <label className='label font-bold'>Time</label>
              <div className='flex justify-between items-center'>
                <TimePicker
                  value={timeStart}
                  onChange={(value) => setTime(value!.toString(), true)}
                  className="input w-[48%] input-bordered"
                  clearIcon={null}
                />
                -
                <TimePicker
                  value={timeEnd}
                  onChange={(value) => setTime(value!.toString(), false)}
                  className="input w-[48%] input-bordered"
                  clearIcon={null}
                />
              </div>
              {errors.time && <p className='text-error'>{errors.time}</p>}
              <label className='label font-bold'>Needs</label>
              <input
                type="text"
                value={needs}
                onChange={(e) => setNeeds(e.target.value)}
                className="input w-full input-bordered"
                placeholder='Needs'
              />
              {errors.needs && <p className='text-error'>{errors.needs}</p>}
              <label className='label font-bold'>Room</label>
              <select
                name='rooms'
                className="input w-full input-bordered"
                value={roomId}
                onChange={(e) => setRoomId(Number(e.target.value))}>
                  {roomData.map((option) => {
                    return (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    )
                  })}
              </select>
            </div>
            <div className="modal-action">
              <button type="button" className="btn" onClick={handleChange}>Close</button>
              {!isMutating ? (
                <button type="submit" className="btn btn-primary">Update</button>
              ) : (
                <button type="button" className="btn">
                  <span className="loading loading-spinner" />
                  Updating...
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function DeleteBooking(booking: Booking) {
  const [modal, setModal] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const router = useRouter();

  async function handleDelete(id: number) {
    setIsMutating(true);
    await axios.delete(`/api/bookings/${id}`)

    setIsMutating(false);
    router.refresh();
    setModal(false);
  }
  function handleChange() {
    setModal(!modal);
  }

  return (
    <div>
      <button
      onClick={handleChange}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <span className="sr-only">Delete</span>
      <TrashIcon className="w-5" />
    </button>
      <input type="checkbox" checked={modal} onChange={handleChange} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Are you sure to delete Booking #{booking.id}?</h3>
          <div className="modal-action">
            <button type="button" className="btn" onClick={handleChange}>Close</button>
            {!isMutating ? (
              <button type="button" onClick={() => handleDelete(booking.id)} className="btn btn-primary">Delete</button>
            ) : (
              <button type="button" className="btn">
                <span className="loading loading-spinner" />
                Deleting...
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
