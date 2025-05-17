ALTER TABLE "location" DROP CONSTRAINT "location_companyId_company_id_fk";
--> statement-breakpoint
ALTER TABLE "location" ADD CONSTRAINT "location_companyId_company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;