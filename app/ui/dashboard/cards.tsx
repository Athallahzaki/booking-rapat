import { fetchCardData } from '@/app/lib/data';
import {
  UserGroupIcon,
  InboxIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const iconMap = {
  bookings: UserGroupIcon,
  booked: InboxIcon,
  rooms: CalendarIcon,
};

export default async function CardWrapper() {
  const {
    totalRooms,
    totalBookings,
    totalBooked,
  } = await fetchCardData();
  return (
    <>

      <Card title="Total Rooms" value={totalRooms} type="rooms" />
      <Card title="Total Bookings Today" value={totalBookings} type="bookings" />
      <Card title="Booked Rooms Today" value={totalBooked.length} type="booked" />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'booked' | 'bookings' | 'rooms';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-[#d4f5ce] p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
