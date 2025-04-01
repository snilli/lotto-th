ALTER TABLE "lotto" RENAME COLUMN "last2_digi" TO "last2_digit";--> statement-breakpoint
ALTER TABLE "lotto" RENAME COLUMN "first3_digi" TO "first3_digit";--> statement-breakpoint
ALTER TABLE "lotto" RENAME COLUMN "last3_digi" TO "last3_digit";--> statement-breakpoint
DROP INDEX "last2_digi_idx";--> statement-breakpoint
DROP INDEX "first3_digi_index";--> statement-breakpoint
DROP INDEX "last3_digi_index";--> statement-breakpoint
CREATE INDEX "last2_digit_idx" ON "lotto" USING btree ("last2_digit");--> statement-breakpoint
CREATE INDEX "first3_digit_index" ON "lotto" USING gin ("first3_digit" jsonb_ops);--> statement-breakpoint
CREATE INDEX "last3_digit_index" ON "lotto" USING gin ("last3_digit" jsonb_ops);