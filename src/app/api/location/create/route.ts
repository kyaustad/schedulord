import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user, location } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { name, address, userId, companyId } = await request.json();

    if (!name || !address || !userId || !companyId) {
      return NextResponse.json(
        { error: "Name, address, userId, and companyId are required" },
        { status: 400 }
      );
    }

    // First check if the user exists
    const userRecord = await db.query.user.findFirst({
      where: and(
        eq(user.id, userId),
        eq(user.companyId, companyId),
        eq(user.role, "admin")
      ),
    });

    if (!userRecord) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [newLocation] = await db
      .insert(location)
      .values({
        name,
        address,
        companyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json({ location: newLocation });
  } catch (error) {
    console.error("Error creating location:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
