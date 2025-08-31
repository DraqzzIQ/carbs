CREATE TABLE `recipe_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`recipe_id` integer NOT NULL,
	`food_id` text NOT NULL,
	`amount` integer NOT NULL,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`food_id`) REFERENCES `foods`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`serving` integer NOT NULL,
	`amount` integer NOT NULL,
	`servings` integer NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_recents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`food_id` text NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`amount` integer NOT NULL,
	`serving_quantity` integer NOT NULL,
	`serving` text NOT NULL,
	`count` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`food_id`) REFERENCES `foods`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_recents`("id", "food_id", "updated_at", "amount", "serving_quantity", "serving", "count") SELECT "id", "food_id", "updated_at", "amount", "serving_quantity", "serving", "count" FROM `recents`;--> statement-breakpoint
DROP TABLE `recents`;--> statement-breakpoint
ALTER TABLE `__new_recents` RENAME TO `recents`;--> statement-breakpoint
PRAGMA foreign_keys=ON;