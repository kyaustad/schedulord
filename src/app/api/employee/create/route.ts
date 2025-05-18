import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { and, eq, or } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const {
      userId,
      email,
      role,
      first_name,
      last_name,
      locationId,
      teamId,
      companyId,
      password,
    } = await request.json();

    if (
      !userId ||
      !email ||
      !role ||
      !first_name ||
      !last_name ||
      !locationId ||
      !teamId ||
      !companyId ||
      !password
    ) {
      return NextResponse.json(
        {
          error:
            "userId, email, role, first_name, last_name, locationId, teamId, companyId, and password are required",
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
    if (userRecord?.role === "manager" && role !== "user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: signUpData, error } = await authClient.signUp.email({
      email: email,
      password: password,
      first_name: first_name,
      last_name: last_name,
      name: `${first_name} ${last_name}`,
      companyId: companyId,
      locationId: locationId,
      teamId: teamId === "-1" ? null : teamId,
      role: role,
    });

    if (error) {
      return NextResponse.json({ error: error }, { status: 400 });
    }

    return NextResponse.json({ user: signUpData });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
