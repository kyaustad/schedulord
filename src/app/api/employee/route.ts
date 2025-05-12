import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { company, user, location, team } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import type { Company } from "@/types/company";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { Employee } from "@/types/employee";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId, scope } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // First check if the user exists
    const userRecord = await db.query.user.findFirst({
      where: and(eq(user.id, userId)),
    });

    if (!userRecord) {
      return NextResponse.json(
        { error: "Unauthorized - User doesn't exist" },
        { status: 403 }
      );
    }

    // If user is not admin, fetch their company
    if (!userRecord.companyId) {
      return NextResponse.json({ companyData: null });
    }

    let employees: Employee[] | null = null;
    if (scope === "user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    } else if (scope === "manager") {
      // For managers, get all employees in their location
      employees = await db.query.user.findMany({
        where: eq(user.locationId, userRecord.locationId!),
      });
    } else if (scope === "admin") {
      // For admins, get all employees in their company
      employees = await db.query.user.findMany({
        where: eq(user.companyId, userRecord.companyId),
      });
    }

    return NextResponse.json({ employees: employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
