import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { ServingDto } from "~/api/types/FoodDetails";

// servingQuantity is the number of servings in the food item
// amount is the amount of the food item per serving in baseUnit
// baseUnit is the unit of measurement for the food item (e.g., grams, milliliters)
// total food is servingQuantity * amount

export const foods = sqliteTable("foods", {
  id: text("id").primaryKey(),
  updatedAt: text("updated_at"),
  deletedAt: text("deleted_at"),
  isCustom: integer("is_custom", { mode: "boolean" }).notNull(),
  isVerified: integer("is_verified", { mode: "boolean" }).notNull(),
  hasEan: integer("has_ean", { mode: "boolean" }).notNull(),
  eans: text("eans", { mode: "json" }).$type<string[]>(),
  valuesPer: real("values_per").notNull().default(1),
  name: text("name").notNull(),
  producer: text("producer"),
  category: text("category").notNull(),
  baseUnit: text("base_unit").notNull(),
  servings: text("servings", { mode: "json" }).notNull().$type<ServingDto[]>(),
  energy: real("energy").notNull(),
  protein: real("protein").notNull(),
  carb: real("carb").notNull(),
  dietaryFiber: real("dietary_fiber"),
  sugar: real("sugar").notNull(),
  // fat
  fat: real("fat").notNull(),
  saturatedFat: real("saturated_fat").notNull(),
  monoUnsaturatedFat: real("mono_unsaturated_fat"),
  polyUnsaturatedFat: real("poly_unsaturated_fat"),
  transFat: real("trans_fat"),
  // misc
  alcohol: real("alcohol"),
  cholesterol: real("cholesterol"),
  sodium: real("sodium"),
  salt: real("salt").notNull(),
  water: real("water"),
  // vitamins
  vitaminA: real("vitamin_a"),
  vitaminB1: real("vitamin_b1"),
  vitaminB11: real("vitamin_b11"), // Folic acid same as vitamin B9
  vitaminB12: real("vitamin_b12"),
  vitaminB2: real("vitamin_b2"),
  vitaminB3: real("vitamin_b3"),
  vitaminB5: real("vitamin_b5"),
  vitaminB6: real("vitamin_b6"),
  vitaminB7: real("vitamin_b7"),
  vitaminC: real("vitamin_c"),
  vitaminD: real("vitamin_d"),
  vitaminE: real("vitamin_e"),
  vitaminK: real("vitamin_k"),
  // minerals
  arsenic: real("arsenic"),
  biotin: real("biotin"),
  boron: real("boron"),
  calcium: real("calcium"),
  chlorine: real("chlorine"),
  choline: real("choline"),
  chrome: real("chrome"),
  cobalt: real("cobalt"),
  copper: real("copper"),
  fluoride: real("fluoride"),
  fluorine: real("fluorine"),
  iodine: real("iodine"),
  iron: real("iron"),
  magnesium: real("magnesium"),
  manganese: real("manganese"),
  molybdenum: real("molybdenum"),
  phosphorus: real("phosphorus"),
  potassium: real("potassium"),
  rubidium: real("rubidium"),
  selenium: real("selenium"),
  silicon: real("silicon"),
  sulfur: real("sulfur"),
  tin: real("tin"),
  vanadium: real("vanadium"),
  zinc: real("zinc"),
});

export const meals = sqliteTable("meals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  foodId: text("food_id")
    .notNull()
    .references(() => foods.id),
  servingQuantity: integer("serving_quantity").notNull(),
  amount: integer("amount").notNull(),
  serving: text("serving").notNull(),
  mealType: text("meal_type").notNull(),
  date: text("date").notNull(),
});

export const favorites = sqliteTable("favorites", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  foodId: text("food_id")
    .notNull()
    .references(() => foods.id),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  amount: integer("amount").notNull(),
  servingQuantity: integer("serving_quantity").notNull(),
  serving: text("serving").notNull(),
});

export const recents = sqliteTable("recents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  foodId: text("food_id")
    .notNull()
    .references(() => foods.id),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  amount: integer("amount").notNull(),
  servingQuantity: integer("serving_quantity").notNull(),
  serving: text("serving").notNull(),
  count: integer("count").notNull().default(1),
});

export const streaks = sqliteTable("streaks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  day: text("day").notNull(),
});

export const recipes = sqliteTable("recipes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const recipeEntries = sqliteTable("recipe_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  recipeId: integer("recipe_id")
    .notNull()
    .references(() => recipes.id),
  foodId: text("food_id")
    .notNull()
    .references(() => foods.id),
  amount: integer("amount").notNull(),
  serving: text("serving").notNull(),
  servingQuantity: integer("serving_quantity").notNull(),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export type Food = typeof foods.$inferSelect;
export type Meal = typeof meals.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
export type Recent = typeof recents.$inferSelect;
export type Streak = typeof streaks.$inferSelect;
export type Recipe = typeof recipes.$inferSelect;
export type RecipeEntry = typeof recipeEntries.$inferSelect;

export const foodsRelations = relations(foods, ({ many }) => ({
  meals: many(meals),
  favorites: many(favorites),
  recents: many(recents),
}));

export const mealsRelations = relations(meals, ({ one }) => ({
  food: one(foods, {
    fields: [meals.foodId],
    references: [foods.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  food: one(foods, {
    fields: [favorites.foodId],
    references: [foods.id],
  }),
}));

export const recentsRelations = relations(recents, ({ one }) => ({
  food: one(foods, {
    fields: [recents.foodId],
    references: [foods.id],
  }),
}));

export const recipesRelations = relations(recipes, ({ many }) => ({
  entries: many(recipeEntries),
}));

export const recipeEntriesRelations = relations(recipeEntries, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeEntries.recipeId],
    references: [recipes.id],
  }),
  food: one(foods, {
    fields: [recipeEntries.foodId],
    references: [foods.id],
  }),
}));
