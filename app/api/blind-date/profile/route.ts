import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { profiles } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  // Upsert profile
  await db
    .insert(profiles)
    .values({
      userId,
      bio: data.bio,
      age: data.age,
      gender: data.gender,
      location: data.location,
      interests: data.interests,
      lookingFor: data.lookingFor,
    })
    .onConflictDoUpdate({
      target: profiles.userId,
      set: {
        bio: data.bio,
        age: data.age,
        gender: data.gender,
        location: data.location,
        interests: data.interests,
        lookingFor: data.lookingFor,
      },
    });
  return NextResponse.json({ success: true });
} 