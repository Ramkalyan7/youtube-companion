import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const videoId = url.searchParams.get("videoId");
  if (!videoId) {
    return NextResponse.json({ error: "videoId query parameter required" }, { status: 400 });
  }

  const notes = await prisma.note.findMany({
    where: { videoId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(notes);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { videoId, content } = body;

  if (!videoId || !content) {
    return NextResponse.json({ error: "videoId and content required" }, { status: 400 });
  }

  const note = await prisma.note.create({
    data: { videoId, content },
  });

  return NextResponse.json(note, { status: 201 });
}
