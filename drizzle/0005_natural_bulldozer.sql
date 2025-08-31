DROP TABLE `servings`;--> statement-breakpoint
ALTER TABLE `foods` ADD `has_ean` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `foods` ADD `eans` text;--> statement-breakpoint
ALTER TABLE `foods` ADD `category` text NOT NULL;--> statement-breakpoint
ALTER TABLE `foods` ADD `servings` text NOT NULL;