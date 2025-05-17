ALTER TABLE "user" DROP CONSTRAINT "user_locationId_location_id_fk";
--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_teamId_team_id_fk";
--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_locationId_location_id_fk" FOREIGN KEY ("locationId") REFERENCES "public"."location"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_teamId_team_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;