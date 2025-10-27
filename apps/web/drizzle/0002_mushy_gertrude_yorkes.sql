ALTER TABLE "authenticator" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "email_verification" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "authenticator" CASCADE;--> statement-breakpoint
DROP TABLE "email_verification" CASCADE;--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_wallet_unique";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_username_unique";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_email_unique";--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_event_id_events_id_fk";
--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bookings_user_id_idx" ON "bookings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "bookings_event_id_idx" ON "bookings" USING btree ("event_id");--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "wallet";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "username";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "password";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "bio";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "profile_image";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "cover_image";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "country";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "city";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "currency";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "timezone";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "last_password_change";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "last_login_at";