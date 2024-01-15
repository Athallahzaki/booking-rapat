import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const today = new Date();
today.setHours(0,0,0,0)

export async function fetchRoomLists() {
  const rooms = await prisma.room.findMany();
  return rooms
}

export async function fetchBookingLists() {
  const bookings = await prisma.booking.findMany({
    include: {
      room: true,
    }
  });
  return bookings
}

const ITEMS_PER_PAGE = 5;
export async function fetchFilteredBookingLists(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const bookings = await prisma.booking.findMany({
    orderBy: {
      date: 'desc',
    },
    include: {
      room: true,
    },
    where: {
      OR: [
        {name: {contains: query}},
        {needs: {contains: query}},
        {room: {
          name: {contains: query},
        },}
      ],
    },
    skip: offset,
    take: ITEMS_PER_PAGE,
  });
  return bookings
}

export async function fetchBookingPages(query:string) {
  const count = await prisma.booking.count({
    where: {
      OR: [
        {name: {contains: query}},
        {needs: {contains: query}},
        {room: {
          name: {contains: query},
        },}
      ],
    },
  });

  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
  return totalPages
}

export async function fetchFilteredRoomLists(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const rooms = await prisma.room.findMany({
    orderBy: {
      location: 'asc',
    },
    where: {
      OR: [
        {name: {contains: query}},
        {location: {contains: query}},
      ],
    },
    skip: offset,
    take: ITEMS_PER_PAGE,
  });
  return rooms
}

export async function fetchRoomPages(query:string) {
  const count = await prisma.room.count({
    where: {
      OR: [
        {name: {contains: query}},
        {location: {contains: query}},
      ],
    },
  });

  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
  return totalPages
}

export async function fetchCardData() {
  const roomsCountPromise = prisma.room.count();
  const bookingsCountPromise = prisma.booking.count({
    where: {
      date: {
        gte: today,
        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), 
      }
    }
  });
  const bookedCountPromise = prisma.booking.groupBy({
    by: ['roomId'],
    where: {
      date: {
        gte: today,
        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), 
      },
    },
    _count: true,
  });

  const [totalRooms, totalBookings, totalBooked] = await Promise.all([
    roomsCountPromise,
    bookingsCountPromise,
    bookedCountPromise,
  ]);

  return {
    totalRooms,
    totalBookings,
    totalBooked,
  }
}