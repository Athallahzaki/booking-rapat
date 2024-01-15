import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"
import type { Room } from "@prisma/client";

const prisma = new PrismaClient();
export const POST = async (request: Request) => {
  const body: Room = await request.json();
  const room = await prisma.room.create({
    data: {
      name: body.name,
      location: body.location,
      image_url: body.image_url,
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(room, {status: 201});
}

export const GET = async () => {
  const room = await prisma.room.findMany({
    select: {
      id: true,
      name: true,
      location: true,
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(room, {status: 200});
}