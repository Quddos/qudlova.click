import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { profiles } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ profile: null });
    }
    const profile = await db.query.profiles.findFirst({ where: eq(profiles.userId, userId) });
    return NextResponse.json({ profile: profile || null });
  } catch (e) {
    return NextResponse.json({ profile: null, error: "Failed to fetch profile" });
  }
} 