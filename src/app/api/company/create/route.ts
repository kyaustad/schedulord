import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { company, user } from "@/db/schema";
import { and, eq } from "drizzle-orm";
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
    const { name, userId } = await request.json();

    if (!name || !userId) {
      return NextResponse.json(
        { error: "Name and userId are required" },
        { status: 400 }
      );
    }

    // First check if the user exists
    const userRecord = await db.query.user.findFirst({
      where: and(eq(user.id, userId), eq(user.role, "admin")),
    });

    if (!userRecord) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [newCompany] = await db
      .insert(company)
      .values({
        name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json({ company: newCompany });
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
