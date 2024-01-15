import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { Room } from "@prisma/client";
const prisma = new PrismaClient();

export const PATCH = async (request: Request, {params}: {params: {id:string}}) => {
  const body: Room = await request.json();
  const room = await prisma.room.update({
    where: {
      id: Number(params.id)
    },
    data: {
      name: body.name,
      location: body.location,
      image_url: body.image_url,
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(room, {status: 200});
}

export const DELETE = async (request: Request, {params}: {params: {id:string}}) => {
  const room = await prisma.room.delete({
    where: {
      id: Number(params.id),
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(room, {status: 200});
}