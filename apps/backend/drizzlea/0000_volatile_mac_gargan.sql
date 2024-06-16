CREATE TABLE IF NOT EXISTS "lotto" (
	"id" date PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"month" smallint NOT NULL,
	"date" smallint NOT NULL,
	"prize1" varchar NOT NULL,
	"prize2" jsonb NOT NULL,
	"prize3" jsonb NOT NULL,
	"prize4" jsonb NOT NULL,
	"prize5" jsonb NOT NULL,
	"last2Digi" varchar NOT NULL,
	"first3Digi" jsonb,
	"last3Digi" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "year_idx" ON "lotto" USING btree ("year");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "month_idx" ON "lotto" USING btree ("month");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "date_idx" ON "lotto" USING btree ("date");