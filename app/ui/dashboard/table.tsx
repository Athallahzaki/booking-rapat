import { fetchFilteredBookingLists } from '@/app/lib/data';
import { DeleteBooking, UpdateBooking } from './buttons';
// import { fetchFilteredInvoices } from '@/app/lib/data';

export default async function BookingsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const bookings = await fetchFilteredBookingLists(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-[#d4f5ce] p-2 md:pt-0">
          <div className="md:hidden">
            {bookings.map((booking) => (
              <div
              key={booking.id}
              className="mb-2 w-full rounded-md bg-white p-4"
            >
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="text-sm text-gray-500">{booking.room.name}</p>
                </div>
                <p className="text-sm text-gray-500">{booking.name}</p>
              </div>
              <div className="flex w-full items-center justify-between pt-4">
                <div>
                  <p className="text-xl font-medium">
                    {booking.needs}
                  </p>
                  <p>{booking.date.toLocaleDateString()}</p>
                  <p>{`${booking.timeStart.toLocaleTimeString()} - ${booking.timeEnd.toLocaleTimeString()}`}</p>
                </div>
                <div className="flex justify-end gap-2">
                  <UpdateBooking {...booking} />
                  <DeleteBooking {...booking} />
                </div>
              </div>
            </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Time
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Room Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Needs
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  User
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {bookings?.map((booking) => (
                <tr
                  key={booking.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3">
                    {booking.date.toDateString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {`${booking.timeStart.toLocaleTimeString()} - ${booking.timeEnd.toLocaleTimeString()}`}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {booking.room.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {booking.needs}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {booking.name}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateBooking {...booking} />
                      <DeleteBooking {...booking} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
