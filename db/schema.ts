import {integer, real, sqliteTable, text} from "drizzle-orm/sqlite-core";

export const foods = sqliteTable('foods', {
    id: integer('id').primaryKey({autoIncrement: true}),
    isCustom: integer('is_custom', {mode: 'boolean'}).notNull(),
    isVerified: integer('is_verified', {mode: 'boolean'}).notNull(),
    name: text('name').notNull(),
    producer: text('producer'),
    servingQuantity: integer('serving_quantity').notNull(),
    amount: integer('amount').notNull(),
    baseUnit: text('base_unit').notNull(),
    energy: real('energy').notNull(),
    protein: real('protein').notNull(),
    carb: real('carb').notNull(),
    dietaryFiber: real('dietary_fiber'),
    sugar: real('sugar').notNull(),
    // fat
    fat: real('fat').notNull(),
    saturatedFat: real('saturated_fat').notNull(),
    monoUnsaturatedFat: real('mono_unsaturated_fat'),
    polyUnsaturatedFat: real('poly_unsaturated_fat'),
    transFat: real('trans_fat'),
    // misc
    alcohol: real('alcohol'),
    Cholesterol: real('cholesterol'),
    sodium: real('sodium'),
    salt: real('salt').notNull(),
    water: real('water'),
    // vitamins
    vitaminA: real('vitamin_a'),
    vitaminB1: real('vitamin_b1'),
    vitaminB2: real('vitamin_b2'),
    vitaminB3: real('vitamin_b3'),
    vitaminB5: real('vitamin_b5'),
    vitaminB6: real('vitamin_b6'),
    vitaminB7: real('vitamin_b7'),
    vitaminB11: real('vitamin_b11'), // Folic acid same as vitamin B9
    vitaminB12: real('vitamin_b12'),
    vitaminC: real('vitamin_c'),
    vitaminD: real('vitamin_d'),
    vitaminE: real('vitamin_e'),
    vitaminK: real('vitamin_k'),
    // minerals
    arsenic: real('arsenic'),
    biotin: real('biotin'),
    boron: real('boron'),
    chloride: real('chloride'),
    choline: real('choline'),
    chromium: real('chromium'),
    iron: real('iron'),
    fluorine: real('fluorine'),
    fluoride: real('fluoride'),
    iodine: real('iodine'),
    potassium: real('potassium'),
    calcium: real('calcium'),
    cobalt: real('cobalt'),
    copper: real('copper'),
    magnesium: real('magnesium'),
    manganese: real('manganese'),
    molybdenum: real('molybdenum'),
    phosphorus: real('phosphorus'),
    rubidium: real('rubidium'),
    sulfur: real('sulfur'),
    selenium: real('selenium'),
    silicon: real('silicon'),
    vanadium: real('vanadium'),
    zinc: real('zinc'),
    tin: real('tin'),
});

export const meals = sqliteTable('meals', {
    id: integer('id').primaryKey({autoIncrement: true}),
    foodId: integer('food_id').notNull().references(() => foods.id),
    mealType: text('meal_type').notNull(),
    date: text('date').notNull(),
});

export const favorites = sqliteTable('favorites', {
    id: integer('id').primaryKey({autoIncrement: true}),
    foodId: integer('food_id').notNull().references(() => foods.id),
    createdAt: text('created_at').notNull(),
});

export const recents = sqliteTable('recents', {
    id: integer('id').primaryKey({autoIncrement: true}),
    foodId: integer('food_id').notNull().references(() => foods.id),
    updatedAt: text('updated_at').notNull(),
    count: integer('count').notNull(),
    servingAmount: integer('serving_amount').notNull(),
});

export type Food = typeof foods.$inferSelect;
export type Meal = typeof meals.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
export type Recent = typeof recents.$inferSelect;