import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user, location } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function DELETE(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { locationId, userId, companyId } = await request.json();

    if (!locationId) {
      return NextResponse.json(
        { error: "Location ID is required" },
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

    const locationRecord = await db.query.location.findFirst({
      where: and(
        eq(location.id, locationId),
        eq(location.companyId, companyId)
      ),
    });

    if (!locationRecord) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      );
    }

    await db
      .delete(location)
      .where(
        and(eq(location.id, locationId), eq(location.companyId, companyId))
      );

    return NextResponse.json({ message: "Location deleted" });
  } catch (error) {
    console.error("Error deleting location:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
