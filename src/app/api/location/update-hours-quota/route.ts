import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user, location } from "@/db/schema";
import { and, eq, or } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { userId, companyId, hoursQuota, locationId } = await request.json();

    if (!userId || !companyId || !hoursQuota || !locationId) {
      return NextResponse.json(
        { error: "userId, companyId, hoursQuota, and locationId are required" },
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

    const updatedLocation = await db
      .update(location)
      .set({
        hoursQuota,
      })
      .where(eq(location.id, locationId));

    return NextResponse.json({
      message: "Hours quota updated",
      location: updatedLocation,
    });
  } catch (error) {
    console.error("Error updating hours quota:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
