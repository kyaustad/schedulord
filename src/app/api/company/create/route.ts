import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { company } from "@/db/schema";

export async function POST(request: NextRequest) {
  try {
    const { name, userId } = await request.json();

    if (!name || !userId) {
      return NextResponse.json(
        { error: "Name and userId are required" },
        { status: 400 }
      );
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
