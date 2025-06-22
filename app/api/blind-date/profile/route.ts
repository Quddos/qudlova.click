import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { profiles, users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  // Check if user exists in users table
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user) {
    console.error("User not found in users table for profile save", userId);
    return NextResponse.json({ error: "User not found. Please try again later or contact support." }, { status: 400 });
  }
  // Generate a unique id for the profile if not provided
  const profileId = data.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2));
  // Upsert profile
  await db
    .insert(profiles)
    .values({
      id: profileId,
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