import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { Booking } from "@prisma/client";
const prisma = new PrismaClient();

export const PATCH = async (request: Request, {params}: {params: {id:string}}) => {
  const body: Booking = await request.json();
  try {
    const existingBookings = await prisma.booking.findMany({
      where: {
        AND: [{
          date: {equals: body.date},
          roomId: {equals: body.roomId},
          OR: [
            { AND: [{ timeStart: { lte: body.timeStart } }, { timeEnd: { gt: body.timeStart } }] },
            { AND: [{ timeStart: { lt: body.timeEnd } }, { timeEnd: { gte: body.timeEnd } }] },
            { AND: [{ timeStart: { gte: body.timeStart } }, { timeEnd: { lte: body.timeEnd } }] },
            { AND: [{ timeStart: { lte: body.timeStart } }, { timeEnd: { gt: body.timeEnd } }] },
            { AND: [{ timeStart: { lte: body.timeStart } }, { timeEnd: { gt: body.timeEnd } }] },
            { AND: [{ timeStart: { lte: body.timeStart } }, { timeEnd: { gt: body.timeStart } }] },
          ]
        }]
      }
    });

    if (existingBookings.length > 0) {
      console.error('Time conflict with existing booking');
      return NextResponse.json('Time conflict with existing booking', {status: 400});
    }

    const room = await prisma.booking.update({
      where: {
        id: Number(params.id)
      },
      data: {
        name: body.name,
        date: body.date,
        timeStart: body.timeStart,
        timeEnd: body.timeEnd,
        needs: body.needs,
        roomId: Number(body.roomId),
      },
    });
  
    return NextResponse.json(room, {status: 200});
  } catch (error) {
    console.error('Error editing booking:', error);
    return NextResponse.json('Error editing booking', {status: 400});
  }
}

export const DELETE = async (request: Request, {params}: {params: {id:string}}) => {
  const room = await prisma.booking.delete({
    where: {
      id: Number(params.id),
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(room, {status: 200});
}