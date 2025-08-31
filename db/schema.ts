import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { ServingDto } from "~/api/types/FoodDetails";

// servingQuantity is the number of servings in the food item
// amount is the amount of the food item per serving in baseUnit
// baseUnit is the unit of measurement for the food item (e.g., grams, milliliters)
// total food is servingQuantity * amount

export const foods = sqliteTable(
  "foods",
  {
    id: text("id").primaryKey(),
    updatedAt: text("updated_at"),
    deletedAt: text("deleted_at"),
    isRecipe: integer("is_recipe", { mode: "boolean" })
      .notNull()
      .default(false),
    recipeServingQuantity: integer("recipe_serving_quantity"),
    isCustom: integer("is_custom", { mode: "boolean" }).notNull(),
    isVerified: integer("is_verified", { mode: "boolean" }).notNull(),
    hasEan: integer("has_ean", { mode: "boolean" }).notNull(),
    eans: text("eans", { mode: "json" }).$type<string[]>(),
    valuesPer: real("values_per").notNull().default(1),
    name: text("name").notNull(),
    producer: text("producer"),
    category: text("category").notNull(),
    baseUnit: text("base_unit").notNull(),
    servings: text("servings", { mode: "json" })
      .notNull()
      .$type<ServingDto[]>(),
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
  },
  (table) => [
    index("idx_foods_isCustom_deleted")
      .on(table.isCustom, table.deletedAt)
      .where(sql`is_custom AND deleted_at IS NULL`),
    index("idx_foods_isCustom_isRecipe").on(table.isCustom, table.isRecipe),
  ],
);

export const meals = sqliteTable(
  "meals",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    foodId: text("food_id")
      .notNull()
      .references(() => foods.id),
    servingQuantity: integer("serving_quantity").notNull(),
    amount: integer("amount").notNull(),
    serving: text("serving").notNull(),
    mealType: text("meal_type").notNull(),
    dateId: text("date_id").notNull(),
  },
  (table) => [
    index("idx_meals_dateId_mealType").on(table.dateId, table.mealType),
  ],
);

export const favorites = sqliteTable(
  "favorites",
  {
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
  },
  (table) => [uniqueIndex("idx_favorites_foodId").on(table.foodId)],
);

export const recents = sqliteTable(
  "recents",
  {
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
  },
  (table) => [
    uniqueIndex("idx_recents_foodId_serving_qty_amount").on(
      table.foodId,
      table.serving,
      table.servingQuantity,
      table.amount,
    ),
  ],
);

export const streaks = sqliteTable(
  "streaks",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    dateId: text("date_id").notNull(),
  },
  (table) => [index("idx_streaks_dateId").on(table.dateId)],
);

// A recipe is a food with isRecipe = true.
// Each entry links that recipe food to a component food.
export const recipeEntries = sqliteTable(
  "recipe_entries",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    recipeFoodId: text("recipe_food_id")
      .notNull()
      .references(() => foods.id),
    componentFoodId: text("component_food_id")
      .notNull()
      .references(() => foods.id),
    amount: integer("amount").notNull(),
    serving: text("serving").notNull(),
    servingQuantity: integer("serving_quantity").notNull(),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => [index("idx_recipeEntries_recipeFoodId").on(table.recipeFoodId)],
);

// Fluid intake entries
// amount is in milliliters

export const fluidIntake = sqliteTable(
  "fluid_intake",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    amount: integer("amount").notNull(),
    dateId: text("date_id").notNull(),
  },
  (table) => [index("idx_fluid_intake_dateId").on(table.dateId)],
);

export type Food = typeof foods.$inferSelect;
export type Meal = typeof meals.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
export type Recent = typeof recents.$inferSelect;
export type Streak = typeof streaks.$inferSelect;
export type RecipeEntry = typeof recipeEntries.$inferSelect;
export type FluidIntake = typeof fluidIntake.$inferSelect;

export const foodsRelations = relations(foods, ({ many }) => ({
  meals: many(meals),
  favorites: many(favorites),
  recents: many(recents),
  // If isRecipe, these are its components
  recipeAssembledFrom: many(recipeEntries, { relationName: "recipe" }),
  // If not isRecipe, where this food is used as a component
  usedInRecipes: many(recipeEntries, { relationName: "component" }),
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

export const recipeEntriesRelations = relations(recipeEntries, ({ one }) => ({
  recipe: one(foods, {
    fields: [recipeEntries.recipeFoodId],
    references: [foods.id],
    relationName: "recipe",
  }),
  component: one(foods, {
    fields: [recipeEntries.componentFoodId],
    references: [foods.id],
    relationName: "component",
  }),
}));
