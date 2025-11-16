import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { eventType, videoId, commentId, userId, timestamp, details } = body;

  if (!eventType || !timestamp) {
    return NextResponse.json({ error: "eventType and timestamp required" }, { status: 400 });
  }

  try {
    const event = await prisma.eventLog.create({
      data: {
        eventType,
        videoId,
        commentId,
        userId,
        timestamp: new Date(timestamp),
        details,
      },
    });
    return NextResponse.json(event, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to log event" }, { status: 500 });
  }
}
