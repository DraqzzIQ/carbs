ALTER TABLE `favorites` RENAME COLUMN "created_at" TO "updated_at";--> statement-breakpoint
ALTER TABLE `favorites` ADD `amount` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `favorites` ADD `serving_quantity` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `favorites` ADD `serving` text NOT NULL;