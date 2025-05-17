ALTER TABLE "team" DROP CONSTRAINT "team_locationId_location_id_fk";
--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_locationId_location_id_fk" FOREIGN KEY ("locationId") REFERENCES "public"."location"("id") ON DELETE cascade ON UPDATE no action;