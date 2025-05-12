import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user, team } from "@/db/schema";
import { and, eq, or } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { name, color, locationId, userId, companyId } = await request.json();

    if (!name || !color || !locationId || !userId || !companyId) {
      return NextResponse.json(
        {
          error: "Name, color, locationId, userId, and companyId are required",
        },
        { status: 400 }
      );
    }

    // First check if the user exists
    const userRecord = await db.query.user.findFirst({
      where: and(
        eq(user.id, userId),
        eq(user.companyId, companyId),
        or(eq(user.role, "admin"), eq(user.role, "manager"))
      ),
    });

    if (!userRecord) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [newTeam] = await db
      .insert(team)
      .values({
        name,
        color,
        locationId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json({ team: newTeam });
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
