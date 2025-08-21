ALTER TABLE `fluid_intake` RENAME COLUMN "date" TO "date_id";--> statement-breakpoint
ALTER TABLE `meals` RENAME COLUMN "date" TO "date_id";--> statement-breakpoint
ALTER TABLE `streaks` RENAME COLUMN "day" TO "date_id";