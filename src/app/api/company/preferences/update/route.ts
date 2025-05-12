import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user, company } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { userId, companyId, locationName, teamName, userName } =
    await request.json();

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

  const updatedCompany = await db
    .update(company)
    .set({
      preferences: {
        names: {
          location: locationName,
          team: teamName,
          user: userName,
        },
      },
    })
    .where(eq(company.id, companyId));

  return NextResponse.json({ company: updatedCompany });
}
