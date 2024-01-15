import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"
import type { Booking } from "@prisma/client";

const prisma = new PrismaClient();
export const POST = async (request: Request) => {
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

    const room = await prisma.booking.create({
      data: {
        name: body.name,
        date: body.date,
        timeStart: body.timeStart,
        timeEnd: body.timeEnd,
        needs: body.needs,
        roomId: Number(body.roomId),
      },
    });
  
    return NextResponse.json(room, {status: 201});
  } catch (error) {
    console.error('Error adding booking:', error);
    return NextResponse.json('Error adding booking', {status: 400});
  }
}