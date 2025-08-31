CREATE TABLE `fluid_intake` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`amount` integer NOT NULL,
	`date` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `recipe_entries` ADD `serving` text NOT NULL;--> statement-breakpoint
ALTER TABLE `recipe_entries` ADD `serving_quantity` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `recipe_entries` ADD `updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL;--> statement-breakpoint
ALTER TABLE `recipes` DROP COLUMN `serving`;--> statement-breakpoint
ALTER TABLE `recipes` DROP COLUMN `amount`;--> statement-breakpoint
ALTER TABLE `recipes` DROP COLUMN `servings`;