CREATE TABLE `servings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`food_id` text NOT NULL,
	`serving` text NOT NULL,
	`amount` integer NOT NULL,
	FOREIGN KEY (`food_id`) REFERENCES `foods`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_foods` (
	`id` text PRIMARY KEY NOT NULL,
	`updated_at` text NOT NULL,
	`is_custom` integer NOT NULL,
	`is_verified` integer NOT NULL,
	`name` text NOT NULL,
	`producer` text,
	`base_unit` text NOT NULL,
	`energy` real NOT NULL,
	`protein` real NOT NULL,
	`carb` real NOT NULL,
	`dietary_fiber` real,
	`sugar` real NOT NULL,
	`fat` real NOT NULL,
	`saturated_fat` real NOT NULL,
	`mono_unsaturated_fat` real,
	`poly_unsaturated_fat` real,
	`trans_fat` real,
	`alcohol` real,
	`cholesterol` real,
	`sodium` real,
	`salt` real NOT NULL,
	`water` real,
	`vitamin_a` real,
	`vitamin_b1` real,
	`vitamin_b11` real,
	`vitamin_b12` real,
	`vitamin_b2` real,
	`vitamin_b3` real,
	`vitamin_b5` real,
	`vitamin_b6` real,
	`vitamin_b7` real,
	`vitamin_c` real,
	`vitamin_d` real,
	`vitamin_e` real,
	`vitamin_k` real,
	`arsenic` real,
	`biotin` real,
	`boron` real,
	`calcium` real,
	`chlorine` real,
	`choline` real,
	`chrome` real,
	`cobalt` real,
	`copper` real,
	`fluoride` real,
	`fluorine` real,
	`iodine` real,
	`iron` real,
	`magnesium` real,
	`manganese` real,
	`molybdenum` real,
	`phosphorus` real,
	`potassium` real,
	`rubidium` real,
	`selenium` real,
	`silicon` real,
	`sulfur` real,
	`tin` real,
	`vanadium` real,
	`zinc` real
);
--> statement-breakpoint
INSERT INTO `__new_foods`("id", "updated_at", "is_custom", "is_verified", "name", "producer", "base_unit", "energy", "protein", "carb", "dietary_fiber", "sugar", "fat", "saturated_fat", "mono_unsaturated_fat", "poly_unsaturated_fat", "trans_fat", "alcohol", "cholesterol", "sodium", "salt", "water", "vitamin_a", "vitamin_b1", "vitamin_b11", "vitamin_b12", "vitamin_b2", "vitamin_b3", "vitamin_b5", "vitamin_b6", "vitamin_b7", "vitamin_c", "vitamin_d", "vitamin_e", "vitamin_k", "arsenic", "biotin", "boron", "calcium", "chlorine", "choline", "chrome", "cobalt", "copper", "fluoride", "fluorine", "iodine", "iron", "magnesium", "manganese", "molybdenum", "phosphorus", "potassium", "rubidium", "selenium", "silicon", "sulfur", "tin", "vanadium", "zinc") SELECT "id", "updated_at", "is_custom", "is_verified", "name", "producer", "base_unit", "energy", "protein", "carb", "dietary_fiber", "sugar", "fat", "saturated_fat", "mono_unsaturated_fat", "poly_unsaturated_fat", "trans_fat", "alcohol", "cholesterol", "sodium", "salt", "water", "vitamin_a", "vitamin_b1", "vitamin_b11", "vitamin_b12", "vitamin_b2", "vitamin_b3", "vitamin_b5", "vitamin_b6", "vitamin_b7", "vitamin_c", "vitamin_d", "vitamin_e", "vitamin_k", "arsenic", "biotin", "boron", "calcium", "chlorine", "choline", "chrome", "cobalt", "copper", "fluoride", "fluorine", "iodine", "iron", "magnesium", "manganese", "molybdenum", "phosphorus", "potassium", "rubidium", "selenium", "silicon", "sulfur", "tin", "vanadium", "zinc" FROM `foods`;--> statement-breakpoint
DROP TABLE `foods`;--> statement-breakpoint
ALTER TABLE `__new_foods` RENAME TO `foods`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_recents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`food_id` text NOT NULL,
	`updated_at` text NOT NULL,
	`amount` integer NOT NULL,
	`serving_quantity` integer NOT NULL,
	`serving` text NOT NULL,
	FOREIGN KEY (`food_id`) REFERENCES `foods`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_recents`("id", "food_id", "updated_at", "amount", "serving_quantity", "serving") SELECT "id", "food_id", "updated_at", "amount", "serving_quantity", "serving" FROM `recents`;--> statement-breakpoint
DROP TABLE `recents`;--> statement-breakpoint
ALTER TABLE `__new_recents` RENAME TO `recents`;--> statement-breakpoint
CREATE TABLE `__new_favorites` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`food_id` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`food_id`) REFERENCES `foods`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_favorites`("id", "food_id", "created_at") SELECT "id", "food_id", "created_at" FROM `favorites`;--> statement-breakpoint
DROP TABLE `favorites`;--> statement-breakpoint
ALTER TABLE `__new_favorites` RENAME TO `favorites`;--> statement-breakpoint
CREATE TABLE `__new_meals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`food_id` text NOT NULL,
	`serving_quantity` integer NOT NULL,
	`amount` integer NOT NULL,
	`serving` text NOT NULL,
	`meal_type` text NOT NULL,
	`date` text NOT NULL,
	FOREIGN KEY (`food_id`) REFERENCES `foods`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_meals`("id", "food_id", "serving_quantity", "amount", "serving", "meal_type", "date") SELECT "id", "food_id", "serving_quantity", "amount", "serving", "meal_type", "date" FROM `meals`;--> statement-breakpoint
DROP TABLE `meals`;--> statement-breakpoint
ALTER TABLE `__new_meals` RENAME TO `meals`;