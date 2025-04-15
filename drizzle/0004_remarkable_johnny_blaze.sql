ALTER TABLE "user" ADD COLUMN "subscribed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "plan" text DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "polar_customer_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "polar_order_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_polar_customer_id_unique" UNIQUE("polar_customer_id");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_polar_order_id_unique" UNIQUE("polar_order_id");