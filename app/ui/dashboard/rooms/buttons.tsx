'use client';

import { SyntheticEvent, useEffect, useState } from 'react';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { Room } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type Errors = {
  name?: string,
  location?: string,
  image?: string,
}

export function CreateRoom() {
  const [modal, setModal] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [isMutating, setIsMutating] = useState(false);
  const [errors, setErrors] = useState<Errors>({}); 
  const [isFormValid, setIsFormValid] = useState(false); 

  const router = useRouter();

  useEffect(() => { 
    validateForm(); 
  }, [name, location, image]); 

  const validateForm = () => {
    let errors: Errors = {};

    if (!name) {
      errors.name = 'Room Name is required.'
    }
    if (!location) {
      errors.location = 'Room Location is required.'
    }
    if (!image) {
      errors.image = 'Image is required'
    } else if (!/^(https?:\/\/|\/)\S+\.(png|jpg|jpeg|gif|bmp|svg)$/i.test(image)) {
      errors.image = 'Image is not a supported type(.png|.jpg|.jpeg|.gif|.bmp|.svg)'
    }

    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  }

  async function handleSubmit(e:SyntheticEvent) {
    e.preventDefault();
    if (isFormValid) {
      setIsMutating(true);
      await axios.post("/api/rooms", {
        name: name,
        location: location,
        image_url: image,
      })

      setIsMutating(false);
      setName('');
      setLocation('');
      setImage('');
      router.refresh();
      setModal(false);
    } else {
      alert('Form is not valid')
    }
  }
  function handleChange() {
    setModal(!modal);
  }

  return (
    <div>
      <button
      onClick={handleChange}
      className="flex h-10 items-center rounded-lg bg-[#59A04C] px-4 text-sm font-medium text-white transition-colors hover:bg-[#59A04C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Add New Room</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </button>
      <input type="checkbox" checked={modal} onChange={handleChange} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Room</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className='label font-bold'>Room Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input w-full input-bordered"
                placeholder='Name'
              />
              {errors.name && <p className='text-error'>{errors.name}</p>}
              <label className='label font-bold'>Room Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input w-full input-bordered"
                placeholder='Location'
              />
              {errors.location && <p className='text-error'>{errors.location}</p>}
              <label className='label font-bold'>Room Image</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="input w-full input-bordered"
                placeholder='Image URL'
              />
              {errors.image && <p className='text-error'>{errors.image}</p>}
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

export function UpdateRoom(room: Room) {
  const [modal, setModal] = useState(false);
  const [name, setName] = useState(room.name);
  const [location, setLocation] = useState(room.location);
  const [image, setImage] = useState(room.image_url);
  const [isMutating, setIsMutating] = useState(false);
  const [errors, setErrors] = useState<Errors>({}); 
  const [isFormValid, setIsFormValid] = useState(false); 

  const router = useRouter();

  useEffect(() => { 
    validateForm(); 
  }, [name, location, image]); 

  const validateForm = () => {
    let errors: Errors = {};

    if (!name) {
      errors.name = 'Room Name is required.'
    }
    if (!location) {
      errors.location = 'Room Location is required.'
    }
    if (!image) {
      errors.image = 'Image is required'
    } else if (!/^(https?:\/\/|\/)\S+\.(png|jpg|jpeg|gif|bmp|svg)$/i.test(image)) {
      errors.image = 'Image is not a supported type(.png|.jpg|.jpeg|.gif|.bmp|.svg)'
    }

    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  }

  async function handleUpdate(e:SyntheticEvent) {
    e.preventDefault();
    if (isFormValid) {
      setIsMutating(true);
      await axios.patch(`/api/rooms/${room.id}`, {
        name: name,
        location: location,
        image_url: image,
      })

      setIsMutating(false);
      router.refresh();
      setModal(false);
    } else {
      alert('Form is not valid')
    }
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
      <span className="sr-only">Edit</span>
      <PencilIcon className="w-5" />
    </button>
      <input type="checkbox" checked={modal} onChange={handleChange} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit Room <i>{room.name}</i></h3>
          <form onSubmit={handleUpdate}>
            <div className="form-control">
              <label className='label font-bold'>Room Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input w-full input-bordered"
                placeholder='Name'
              />
              {errors.name && <p className='text-error'>{errors.name}</p>}
              <label className='label font-bold'>Room Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input w-full input-bordered"
                placeholder='Location'
              />
              {errors.location && <p className='text-error'>{errors.location}</p>}
              <label className='label font-bold'>Room Image</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="input w-full input-bordered"
                placeholder='Image URL'
              />
              {errors.image && <p className='text-error'>{errors.image}</p>}
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

export function DeleteRoom(room: Room) {
  const [modal, setModal] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const router = useRouter();

  async function handleDelete(id: number) {
    setIsMutating(true);
    await axios.delete(`/api/rooms/${id}`)

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
          <h3 className="font-bold text-lg">Are you sure to delete Room <i>{room.name}</i>?</h3>
          <div className="modal-action">
            <button type="button" className="btn" onClick={handleChange}>Close</button>
            {!isMutating ? (
              <button type="button" onClick={() => handleDelete(room.id)} className="btn btn-primary">Delete</button>
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
