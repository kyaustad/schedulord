import { db } from "@/db";
import { company, location, team, user } from "@/db/schema";
import { auth } from "@/lib/auth";
import type { Company } from "@/types/company";
import { and, eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Define the type for preferences to ensure type safety
type CompanyPreferences = {
	names: {
		location: string;
		team: string;
		user?: string;
		manager?: string;
	};
};

export async function POST(request: NextRequest) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { userId, role } = await request.json();

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

		let userCompany: Company | null = null;
		if (role === "user") {
			const companyData = await db.query.company.findFirst({
				where: eq(company.id, userRecord.companyId),
			});
			userCompany = companyData
				? {
						...companyData,
						preferences: companyData.preferences as
							| CompanyPreferences
							| undefined,

						weekStart: companyData.weekStart as
							| "monday"
							| "tuesday"
							| "wednesday"
							| "thursday"
							| "friday"
							| "saturday"
							| "sunday",
				  }
				: null;
		} else if (role === "manager") {
			// For managers, get their specific location and its teams
			const [companyData, locationData] = await Promise.all([
				db.query.company.findFirst({
					where: eq(company.id, userRecord.companyId),
				}),
				db.query.location.findFirst({
					where: eq(location.id, userRecord.locationId!),
				}),
			]);

			if (companyData && locationData) {
				const teams = await db.query.team.findMany({
					where: eq(team.locationId, locationData.id),
				});

				userCompany = {
					...companyData,
					preferences: companyData.preferences as
						| CompanyPreferences
						| undefined,
					locations: [
						{
							...locationData,
							teams,
							hoursQuota: locationData.hoursQuota ?? 0,
						},
					],
					weekStart: companyData.weekStart as
						| "monday"
						| "tuesday"
						| "wednesday"
						| "thursday"
						| "friday"
						| "saturday"
						| "sunday",
				};
			} else {
				userCompany = null;
			}
		} else if (role === "admin") {
			// For admins, get all locations and their teams
			const [companyData, locations] = await Promise.all([
				db.query.company.findFirst({
					where: eq(company.id, userRecord.companyId),
				}),
				db.query.location.findMany({
					where: eq(location.companyId, userRecord.companyId),
				}),
			]);

			if (companyData && locations.length > 0) {
				const locationIds = locations.map((loc) => loc.id);
				const teams = await db.query.team.findMany({
					where: inArray(team.locationId, locationIds),
				});

				// Group teams by location
				const teamsByLocation = teams.reduce((acc, team) => {
					if (!acc[team.locationId]) {
						acc[team.locationId] = [];
					}
					acc[team.locationId].push(team);
					return acc;
				}, {} as Record<number, typeof teams>);

				userCompany = {
					...companyData,
					preferences: companyData.preferences as
						| CompanyPreferences
						| undefined,
					weekStart: companyData.weekStart as
						| "monday"
						| "tuesday"
						| "wednesday"
						| "thursday"
						| "friday"
						| "saturday"
						| "sunday",
					locations: locations.map((loc) => ({
						...loc,
						teams: teamsByLocation[loc.id] || [],
						hoursQuota: loc.hoursQuota ?? 0,
					})),
				};
			} else {
				userCompany = companyData
					? {
							...companyData,
							preferences: companyData.preferences as
								| CompanyPreferences
								| undefined,
							weekStart: companyData.weekStart as
								| "monday"
								| "tuesday"
								| "wednesday"
								| "thursday"
								| "friday"
								| "saturday"
								| "sunday",
					  }
					: null;
			}
		}

		return NextResponse.json({ companyData: userCompany });
	} catch (error) {
		console.error("Error fetching companies:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
