import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user, team } from "@/db/schema";
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
    const { teamId, userId, companyId } = await request.json();

    if (!teamId) {
      return NextResponse.json(
        { error: "Team ID is required" },
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

    const teamRecord = await db.query.team.findFirst({
      where: eq(team.id, teamId),
    });

    if (!teamRecord) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    await db.delete(team).where(eq(team.id, teamId));

    return NextResponse.json({ message: "Team deleted" });
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
