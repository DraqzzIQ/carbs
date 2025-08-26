DROP TABLE `recipes`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_recipe_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`recipe_food_id` text NOT NULL,
	`component_food_id` text NOT NULL,
	`amount` integer NOT NULL,
	`serving` text NOT NULL,
	`serving_quantity` integer NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`recipe_food_id`) REFERENCES `foods`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`component_food_id`) REFERENCES `foods`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_recipe_entries`("id", "recipe_food_id", "component_food_id", "amount", "serving", "serving_quantity", "updated_at") SELECT "id", "recipe_food_id", "component_food_id", "amount", "serving", "serving_quantity", "updated_at" FROM `recipe_entries`;--> statement-breakpoint
DROP TABLE `recipe_entries`;--> statement-breakpoint
ALTER TABLE `__new_recipe_entries` RENAME TO `recipe_entries`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `foods` ADD `is_recipe` integer DEFAULT false NOT NULL;