CREATE UNIQUE INDEX `idx_favorites_foodId` ON `favorites` (`food_id`);--> statement-breakpoint
CREATE INDEX `idx_fluid_intake_dateId` ON `fluid_intake` (`date_id`);--> statement-breakpoint
CREATE INDEX `idx_foods_isCustom_deleted` ON `foods` (`is_custom`,`deleted_at`) WHERE is_custom AND deleted_at IS NULL;--> statement-breakpoint
CREATE INDEX `idx_foods_isCustom_isRecipe` ON `foods` (`is_custom`,`is_recipe`);--> statement-breakpoint
CREATE INDEX `idx_meals_dateId_mealType` ON `meals` (`date_id`,`meal_type`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_recents_foodId_serving_qty_amount` ON `recents` (`food_id`,`serving`,`serving_quantity`,`amount`);--> statement-breakpoint
CREATE INDEX `idx_recipeEntries_recipeFoodId` ON `recipe_entries` (`recipe_food_id`);--> statement-breakpoint
CREATE INDEX `idx_streaks_dateId` ON `streaks` (`date_id`);