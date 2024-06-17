ALTER TABLE "lotto" RENAME COLUMN "last2Digi" TO "last2_digi";--> statement-breakpoint
ALTER TABLE "lotto" RENAME COLUMN "first3Digi" TO "first3_digi";--> statement-breakpoint
ALTER TABLE "lotto" RENAME COLUMN "last3Digi" TO "last3_digi";--> statement-breakpoint
ALTER TABLE "lotto" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "lotto" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
DROP INDEX IF EXISTS "last2_digi_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "first3_digi_index";--> statement-breakpoint
DROP INDEX IF EXISTS "last3_digi_index";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "last2_digi_idx" ON "lotto" USING btree ("last2_digi");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "first3_digi_index" ON "lotto" USING gin ("first3_digi" jsonb_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "last3_digi_index" ON "lotto" USING gin ("last3_digi" jsonb_ops);