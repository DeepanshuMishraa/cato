CREATE TABLE "website_log" (
	"id" text PRIMARY KEY NOT NULL,
	"website_id" text NOT NULL,
	"checked_at" timestamp NOT NULL,
	"response_time" integer NOT NULL,
	"status_code" integer NOT NULL,
	"is_up" boolean NOT NULL
);
--> statement-breakpoint
ALTER TABLE "website_log" ADD CONSTRAINT "website_log_website_id_website_id_fk" FOREIGN KEY ("website_id") REFERENCES "public"."website"("id") ON DELETE cascade ON UPDATE no action;