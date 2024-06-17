ALTER TABLE "lotto" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "id_idx" ON "lotto" USING btree (("id"::date));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prize1_idx" ON "lotto" USING btree ("prize1");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prize2_index" ON "lotto" USING gin ("prize2" jsonb_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prize3_index" ON "lotto" USING gin ("prize3" jsonb_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prize4_index" ON "lotto" USING gin ("prize4" jsonb_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prize5_index" ON "lotto" USING gin ("prize5" jsonb_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "last2_digi_idx" ON "lotto" USING btree ("last2Digi");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "first3_digi_index" ON "lotto" USING gin ("first3Digi" jsonb_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "last3_digi_index" ON "lotto" USING gin ("last3Digi" jsonb_ops);