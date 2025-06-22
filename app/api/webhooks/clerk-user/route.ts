import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/drizzle/schema";

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();
    if (event.type !== "user.created") {
      return NextResponse.json({ message: "Ignored" }, { status: 200 });
    }
    const user = event.data;
    // Insert user into Drizzle DB
    await db.insert(users).values({
      id: user.id,
      email: user.email_addresses?.[0]?.email_address || user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      imageUrl: user.image_url,
    });
    return NextResponse.json({ message: "User synced" }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
} 