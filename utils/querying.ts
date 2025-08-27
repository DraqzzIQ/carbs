import { MealType } from "~/types/MealType";
import { yazioGetFoodDetails } from "~/api/yazio";
import { FoodDetailsDto, ServingDto } from "~/api/types/FoodDetails";
import { db } from "~/db/client";
import {
  favorites,
  fluidIntake,
  Food,
  foods,
  meals,
  recents,
  recipeEntries,
  streaks,
} from "~/db/schema";
import { and, asc, eq, isNull, like, ne } from "drizzle-orm";
import { formatNumber, isBaseUnit } from "~/utils/formatting";
import { inArray } from "drizzle-orm/sql/expressions/conditions";
import { FoodSearchResultDto } from "~/api/types/FoodSearchResultDto";
import { ServingType } from "~/types/ServingType";
import { getDefaultValuesForServing } from "~/utils/serving";

export async function removeFoodFromMeal(mealId: number) {
  try {
    await db.delete(meals).where(and(eq(meals.id, mealId)));
  } catch (error) {
    console.error(`Error removing meal with ID ${mealId}:`, error);
  }
}

export async function addFoodToMeal(
  meal: MealType,
  foodId: string,
  servingQuantity: number,
  amount: number,
  serving: string,
  dateId: string,
  food: Food | undefined = undefined,
): Promise<boolean> {
  if (food === undefined) {
    food = await getAndSaveFood(foodId);
    if (food === undefined) {
      console.error(`Couldn't add Product with ID ${foodId}.`);
      return false;
    }
  }

  await updateStreak(dateId);
  await updateOrAddRecent(foodId, servingQuantity, amount, serving);

  try {
    await db.insert(meals).values({
      foodId: food.id,
      servingQuantity: servingQuantity,
      amount: amount,
      serving: serving,
      mealType: meal,
      dateId: dateId,
    });
  } catch (error) {
    console.error(
      `Error adding product to meal: ${meal}, product ID: ${foodId}`,
      error,
    );
    return false;
  }
  return true;
}

export async function getAndSaveFood(
  foodId: string,
): Promise<Food | undefined> {
  const food = (await yazioGetFoodDetails(foodId)) ?? undefined;
  if (!food) {
    console.error(`Couldn't find Product with ID ${foodId}.`);
    return undefined;
  }

  const lastUpdatedAt = await getFoodUpdatedAt(foodId);
  if (lastUpdatedAt === undefined) {
    await addFood(food);
  } else if (lastUpdatedAt !== food.updated_at) {
    await updateFood(food);
  }

  return (await getSavedFood(foodId)) ?? undefined;
}

export async function getCustomFood(foodId: string): Promise<Food | undefined> {
  try {
    return await db.query.foods.findFirst({
      where: eq(foods.id, foodId),
    });
  } catch (error) {
    console.error(`Error getting custom food with ID ${foodId}:`, error);
    return undefined;
  }
}

export async function updateMeal(
  mealId: number,
  servingQuantity: number,
  amount: number,
  serving: string,
  mealType: MealType,
) {
  try {
    await db
      .update(meals)
      .set({
        amount: amount,
        servingQuantity: servingQuantity,
        serving: serving,
        mealType: mealType,
      })
      .where(eq(meals.id, mealId));
  } catch (error) {
    console.error(`Error updating meal with ID ${mealId}:`, error);
  }
}

export async function isRecent(foodId: string): Promise<boolean> {
  const lastYear = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
  try {
    const recent = await db.query.recents.findFirst({
      where: eq(recents.foodId, foodId),
    });
    if (!recent) {
      return false;
    }
    return new Date(recent.updatedAt) >= lastYear;
  } catch (error) {
    console.error(`Error checking if food is recent with ID ${foodId}:`, error);
    return false;
  }
}

export async function getRecentFoods(foodIds: string[]): Promise<Set<string>> {
  const uniqueFoodIds = [...new Set(foodIds)];
  if (uniqueFoodIds.length === 0) return new Set();
  try {
    const recentFoodIds = await db.query.recents.findMany({
      where: inArray(recents.foodId, uniqueFoodIds),
      columns: {
        foodId: true,
      },
    });
    return new Set(recentFoodIds.map((recent) => recent.foodId));
  } catch (error) {
    console.error("Error fetching recent foods:", error);
    return new Set();
  }
}

export async function getIsFavorite(foodId: string): Promise<boolean> {
  try {
    const favorite = await db.query.favorites.findFirst({
      where: eq(favorites.foodId, foodId),
    });
    return !!favorite;
  } catch (error) {
    console.error(
      `Error checking if food is favorite with ID ${foodId}:`,
      error,
    );
    return false;
  }
}

export async function removeFavorite(foodId: string) {
  try {
    await db.delete(favorites).where(eq(favorites.foodId, foodId));
  } catch (error) {
    console.error(`Error removing favorite for food ID ${foodId}:`, error);
  }
}

export async function getFavoriteFoods(
  foodIds: string[],
): Promise<Set<string>> {
  const uniqueFoodIds = [...new Set(foodIds)];
  if (uniqueFoodIds.length === 0) return new Set();
  try {
    const favoriteFoodIds = await db.query.favorites.findMany({
      where: inArray(favorites.foodId, uniqueFoodIds),
      columns: {
        foodId: true,
      },
    });
    return new Set(favoriteFoodIds.map((favorite) => favorite.foodId));
  } catch (error) {
    console.error("Error fetching favorite foods:", error);
    return new Set();
  }
}

export async function addFavorite(
  foodId: string,
  servingQuantity: number,
  amount: number,
  serving: string,
) {
  try {
    await db.insert(favorites).values({
      foodId: foodId,
      amount: amount,
      servingQuantity: servingQuantity,
      serving: serving,
    });
  } catch (error) {
    console.error(`Error setting favorite for food ID ${foodId}:`, error);
  }
}

export async function addCustomFood(food: Food) {
  try {
    await db.insert(foods).values(food);
  } catch (error) {
    console.error(`Error adding custom food with ID ${food.id}:`, error);
  }
}

export async function updateCustomFood(food: Food) {
  try {
    await db.update(foods).set(food).where(eq(foods.id, food.id));
  } catch (error) {
    console.error(`Error updating custom food with ID ${food.id}:`, error);
  }
}

export async function deleteCustomFood(foodId: string) {
  try {
    await removeFavorite(foodId);
    await db
      .update(foods)
      .set({ deletedAt: new Date().toISOString() })
      .where(eq(foods.id, foodId));
    await db
      .delete(recipeEntries)
      .where(eq(recipeEntries.recipeFoodId, foodId));
  } catch (error) {
    console.error(`Error deleting custom food with ID ${foodId}:`, error);
  }
}

export async function queryCustomFoods(
  query: string,
  barCode = false,
  isRecipe: boolean | undefined = undefined,
): Promise<FoodSearchResultDto[]> {
  try {
    const result = await db.query.foods.findMany({
      where: and(
        eq(foods.isCustom, true),
        isNull(foods.deletedAt),
        ne(foods.category, "quick-entry"),
        barCode
          ? like(foods.eans, `%${query}%`)
          : like(foods.name, `%${query}%`),
        isRecipe === undefined ? undefined : eq(foods.isRecipe, isRecipe),
      ),
      limit: 5,
    });
    return result.map((food) => {
      const servingValues = getDefaultValuesForServing(
        food.servings,
        food.baseUnit,
      );
      return {
        score: -1,
        name: food.name,
        productId: food.id,
        serving: servingValues.serving,
        servingQuantity: servingValues.servingQuantity,
        amount: servingValues.amount,
        baseUnit: food.baseUnit,
        producer: food.producer ?? "",
        isVerified: food.isVerified,
        nutrients: {
          energy: food.energy,
          carb: food.carb,
          fat: food.fat,
          protein: food.protein,
        },
        countries: [],
        language: "",
      };
    });
  } catch (error) {
    console.error("Error querying custom foods:", error);
    return [];
  }
}

export async function addFluidIntake(
  amount: number,
  dateId: string,
): Promise<void> {
  try {
    await db.insert(fluidIntake).values({
      amount: amount,
      dateId: dateId,
    });
  } catch (error) {
    console.error(`Error adding fluid intake for dateId ${dateId}:`, error);
  }
}

export async function deleteFluidIntake(id: number): Promise<void> {
  try {
    await db.delete(fluidIntake).where(eq(fluidIntake.id, id));
  } catch (error) {
    console.error(`Error deleting fluid intake with ID ${id}:`, error);
  }
}

export async function getAllStreaks(): Promise<string[]> {
  try {
    const results = await db.query.streaks.findMany({
      columns: { dateId: true },
      orderBy: (streaks) => [asc(streaks.dateId)],
    });
    return results.map((streak) => streak.dateId);
  } catch (error) {
    console.error("Error getting all streaks:", error);
    return [];
  }
}

export async function addRecipeEntry(
  recipeFoodId: string,
  componentFoodId: string,
  servingQuantity: number,
  amount: number,
  serving: string,
  food: Food | undefined = undefined,
): Promise<boolean> {
  try {
    if (food === undefined) {
      food = await getAndSaveFood(componentFoodId);
      if (food === undefined) {
        console.error(
          `Couldn't save FoodComponent with ID ${componentFoodId}.`,
        );
        return false;
      }
    }
    await db.insert(recipeEntries).values({
      recipeFoodId,
      componentFoodId,
      servingQuantity,
      amount,
      serving,
    });

    await updateRecipeNutrients(recipeFoodId);
    return true;
  } catch (error) {
    console.error(
      `Error adding food component to recipe. Recipe ID: ${recipeFoodId}, Component ID: ${componentFoodId}`,
      error,
    );
    return false;
  }
}

export async function editRecipeEntry(
  entryId: number,
  servingQuantity: number,
  amount: number,
  serving: string,
) {
  try {
    const entry = await db.query.recipeEntries.findFirst({
      where: eq(recipeEntries.id, entryId),
      columns: { recipeFoodId: true },
    });

    await db
      .update(recipeEntries)
      .set({ servingQuantity, amount, serving })
      .where(eq(recipeEntries.id, entryId));

    if (entry?.recipeFoodId) {
      await updateRecipeNutrients(entry.recipeFoodId);
    }
  } catch (error) {
    console.error(`Error editing recipe entry with ID ${entryId}:`, error);
  }
}

export async function deleteRecipeEntry(entryId: number) {
  try {
    const entry = await db.query.recipeEntries.findFirst({
      where: eq(recipeEntries.id, entryId),
      columns: { recipeFoodId: true },
    });

    await db.delete(recipeEntries).where(eq(recipeEntries.id, entryId));

    if (entry?.recipeFoodId) {
      await updateRecipeNutrients(entry.recipeFoodId);
    }
  } catch (error) {
    console.error(`Error deleting recipe entry with ID ${entryId}:`, error);
  }
}

export async function getRecipeEntry(entryId: number) {
  try {
    return await db.query.recipeEntries.findFirst({
      where: eq(recipeEntries.id, entryId),
      with: { component: true },
    });
  } catch (error) {
    console.error(`Error getting recipe entry with ID ${entryId}:`, error);
    return null;
  }
}

async function addFood(food: FoodDetailsDto) {
  try {
    await db
      .insert(foods)
      .values({ ...getProductProperties(food), id: food.id });
  } catch (error) {
    console.error(`Error adding product with ID ${food.id}:`, error);
  }
}

async function updateFood(food: FoodDetailsDto) {
  try {
    await db
      .update(foods)
      .set(getProductProperties(food))
      .where(eq(foods.id, food.id));
  } catch (error) {
    console.error(`Error updating food with ID ${food.id}:`, error);
  }
}

async function getFoodUpdatedAt(
  foodId: string,
): Promise<string | null | undefined> {
  try {
    const result = await db.query.foods.findFirst({
      columns: { updatedAt: true },
      where: eq(foods.id, foodId),
    });
    return result?.updatedAt;
  } catch (error) {
    console.error(`Error checking if food exists with ID ${foodId}:`, error);
    return undefined;
  }
}

async function getSavedFood(foodId: string) {
  try {
    return await db.query.foods.findFirst({
      where: eq(foods.id, foodId),
    });
  } catch (error) {
    console.error(`Error getting saved food with ID ${foodId}:`, error);
    return null;
  }
}

async function updateStreak(dateId: string) {
  try {
    const existingStreak = await db.query.streaks.findFirst({
      where: eq(streaks.dateId, dateId),
    });

    if (!existingStreak) {
      await db.insert(streaks).values({ dateId: dateId });
    }
  } catch (error) {
    console.error(`Error updating streak for dateId ${dateId}:`, error);
  }
}

async function updateOrAddRecent(
  foodId: string,
  servingQuantity: number,
  amount: number,
  serving: string,
) {
  if (isBaseUnit(serving)) {
    serving = serving.toLowerCase();
  }
  try {
    const existingRecent = await db.query.recents.findFirst({
      where: and(
        eq(recents.foodId, foodId),
        eq(recents.serving, serving),
        eq(recents.servingQuantity, servingQuantity),
        eq(recents.amount, amount),
      ),
    });

    if (existingRecent) {
      await db
        .update(recents)
        .set({ count: existingRecent.count + 1 })
        .where(eq(recents.id, existingRecent.id));
    } else {
      await db.insert(recents).values({
        foodId: foodId,
        amount: amount,
        servingQuantity: servingQuantity,
        serving: serving,
      });
    }
  } catch (error) {
    console.error(
      `Error updating or adding recent for food ID ${foodId}:`,
      error,
    );
  }
}

export async function updateRecipeServings(
  recipeFoodId: string,
  totalWeight: number,
) {
  try {
    const recipeFood = await db.query.foods.findFirst({
      where: eq(foods.id, recipeFoodId),
      columns: {
        recipeServingQuantity: true,
      },
    });
    await db
      .update(foods)
      .set({
        servings:
          totalWeight > 0
            ? [
                {
                  amount: Number(
                    formatNumber(
                      totalWeight / (recipeFood?.recipeServingQuantity ?? 1),
                    ),
                  ),
                  serving: ServingType.Serving,
                },
                {
                  amount: totalWeight,
                  serving: ServingType.Whole,
                },
              ]
            : [],
      })
      .where(eq(foods.id, recipeFoodId));
  } catch (error) {
    console.error(
      `Error updating recipe servings for recipe ID ${recipeFoodId}:`,
      error,
    );
  }
}

async function updateRecipeNutrients(recipeFoodId: string) {
  try {
    const entries = await db.query.recipeEntries.findMany({
      where: eq(recipeEntries.recipeFoodId, recipeFoodId),
      columns: {
        componentFoodId: true,
        servingQuantity: true,
        amount: true,
      },
    });

    // Aggregate duplicate components and compute total weight (denominator)
    const weightByFoodId = new Map<string, number>();
    let totalWeight = 0;
    for (const e of entries) {
      const w = (e.servingQuantity ?? 0) * (e.amount ?? 0);
      if (w <= 0) continue;
      totalWeight += w;
      weightByFoodId.set(
        e.componentFoodId,
        (weightByFoodId.get(e.componentFoodId) ?? 0) + w,
      );
    }

    const totals = Object.fromEntries(
      NUTRIENT_KEYS.map((k) => [k, 0]),
    ) as Record<NutrientKey, number>;

    if (weightByFoodId.size === 0 || totalWeight === 0) {
      await db.update(foods).set(totals).where(eq(foods.id, recipeFoodId));
      await updateRecipeServings(recipeFoodId, totalWeight);
      return;
    }

    // Fetch all component foods in one query
    const componentFoods = await db.query.foods.findMany({
      where: inArray(foods.id, [...weightByFoodId.keys()]),
    });

    // Weighted sum: sum(nutrient * weight)
    for (const food of componentFoods) {
      const w = weightByFoodId.get(food.id) ?? 0;
      const f = food as Partial<Record<NutrientKey, number | null | undefined>>;
      for (const k of NUTRIENT_KEYS) {
        totals[k] += (f[k] ?? 0) * w;
      }
    }

    // Divide by total weight to get per-gram averages
    for (const k of NUTRIENT_KEYS) {
      totals[k] = totals[k] / totalWeight;
    }

    await db.update(foods).set(totals).where(eq(foods.id, recipeFoodId));
    await updateRecipeServings(recipeFoodId, totalWeight);
  } catch (error) {
    console.error(
      `Error updating recipe nutrients for recipe ID ${recipeFoodId}:`,
      error,
    );
  }
}

function getProductProperties(food: FoodDetailsDto): {
  updatedAt: string | null;
  isCustom: boolean;
  isVerified: boolean;
  hasEan: boolean;
  eans?: string[];
  name: string;
  producer: string | null;
  category: string;
  baseUnit: string;
  servings: ServingDto[];
  energy: number;
  protein: number;
  carb: number;
  dietaryFiber?: number;
  sugar: number;
  fat: number;
  saturatedFat: number;
  monoUnsaturatedFat?: number;
  polyUnsaturatedFat?: number;
  transFat?: number;
  alcohol?: number;
  cholesterol?: number;
  sodium?: number;
  salt: number;
  water?: number;
  vitaminA?: number;
  vitaminB1?: number;
  vitaminB11?: number;
  vitaminB12?: number;
  vitaminB2?: number;
  vitaminB3?: number;
  vitaminB5?: number;
  vitaminB6?: number;
  vitaminB7?: number;
  vitaminC?: number;
  vitaminD?: number;
  vitaminE?: number;
  vitaminK?: number;
  arsenic?: number;
  biotin?: number;
  boron?: number;
  calcium?: number;
  chlorine?: number;
  choline?: number;
  chrome?: number;
  cobalt?: number;
  copper?: number;
  fluoride?: number;
  fluorine?: number;
  iodine?: number;
  iron?: number;
  magnesium?: number;
  manganese?: number;
  molybdenum?: number;
  phosphorus?: number;
  potassium?: number;
  rubidium?: number;
  selenium?: number;
  silicon?: number;
  sulfur?: number;
  tin?: number;
  vanadium?: number;
  zinc?: number;
} {
  return {
    updatedAt: food.updated_at,
    isCustom: food.is_custom,
    isVerified: food.is_verified,
    hasEan: food.has_ean,
    eans: food.eans,
    name: food.name,
    producer: food.producer,
    category: food.category,
    baseUnit: food.base_unit,
    servings: food.servings,
    energy: food.nutrients["energy.energy"],
    protein: food.nutrients["nutrient.protein"],
    carb: food.nutrients["nutrient.carb"],
    dietaryFiber: food.nutrients["nutrient.dietaryfiber"],
    sugar: food.nutrients["nutrient.sugar"],
    fat: food.nutrients["nutrient.fat"],
    saturatedFat: food.nutrients["nutrient.saturated"],
    monoUnsaturatedFat: food.nutrients["nutrient.monounsaturated"],
    polyUnsaturatedFat: food.nutrients["nutrient.polyunsaturated"],
    transFat: food.nutrients["nutrient.transfat"],
    alcohol: food.nutrients["nutrient.alcohol"],
    cholesterol: food.nutrients["nutrient.cholesterol"],
    sodium: food.nutrients["nutrient.sodium"],
    salt: food.nutrients["nutrient.salt"],
    water: food.nutrients["nutrient.water"],
    vitaminA: food.nutrients["vitamin.a"],
    vitaminB1: food.nutrients["vitamin.b1"],
    vitaminB11: food.nutrients["vitamin.b11"],
    vitaminB12: food.nutrients["vitamin.b12"],
    vitaminB2: food.nutrients["vitamin.b2"],
    vitaminB3: food.nutrients["vitamin.b3"],
    vitaminB5: food.nutrients["vitamin.b5"],
    vitaminB6: food.nutrients["vitamin.b6"],
    vitaminB7: food.nutrients["vitamin.b7"],
    vitaminC: food.nutrients["vitamin.c"],
    vitaminD: food.nutrients["vitamin.d"],
    vitaminE: food.nutrients["vitamin.e"],
    vitaminK: food.nutrients["vitamin.k"],
    arsenic: food.nutrients["mineral.arsenic"],
    biotin: food.nutrients["mineral.biotin"],
    boron: food.nutrients["mineral.boron"],
    calcium: food.nutrients["mineral.calcium"],
    chlorine: food.nutrients["mineral.chlorine"],
    choline: food.nutrients["mineral.choline"],
    chrome: food.nutrients["mineral.chrome"],
    cobalt: food.nutrients["mineral.cobalt"],
    copper: food.nutrients["mineral.copper"],
    fluoride: food.nutrients["mineral.fluoride"],
    fluorine: food.nutrients["mineral.fluorine"],
    iodine: food.nutrients["mineral.iodine"],
    iron: food.nutrients["mineral.iron"],
    magnesium: food.nutrients["mineral.magnesium"],
    manganese: food.nutrients["mineral.manganese"],
    molybdenum: food.nutrients["mineral.molybdenum"],
    phosphorus: food.nutrients["mineral.phosphorus"],
    potassium: food.nutrients["mineral.potassium"],
    rubidium: food.nutrients["mineral.rubidium"],
    selenium: food.nutrients["mineral.selenium"],
    silicon: food.nutrients["mineral.silicon"],
    sulfur: food.nutrients["mineral.sulfur"],
    tin: food.nutrients["mineral.tin"],
    vanadium: food.nutrients["mineral.vanadium"],
    zinc: food.nutrients["mineral.zinc"],
  };
}

const NUTRIENT_KEYS = [
  "energy",
  "protein",
  "carb",
  "dietaryFiber",
  "sugar",
  "fat",
  "saturatedFat",
  "monoUnsaturatedFat",
  "polyUnsaturatedFat",
  "transFat",
  "alcohol",
  "cholesterol",
  "sodium",
  "salt",
  "water",
  "vitaminA",
  "vitaminB1",
  "vitaminB11",
  "vitaminB12",
  "vitaminB2",
  "vitaminB3",
  "vitaminB5",
  "vitaminB6",
  "vitaminB7",
  "vitaminC",
  "vitaminD",
  "vitaminE",
  "vitaminK",
  "arsenic",
  "biotin",
  "boron",
  "calcium",
  "chlorine",
  "choline",
  "chrome",
  "cobalt",
  "copper",
  "fluoride",
  "fluorine",
  "iodine",
  "iron",
  "magnesium",
  "manganese",
  "molybdenum",
  "phosphorus",
  "potassium",
  "rubidium",
  "selenium",
  "silicon",
  "sulfur",
  "tin",
  "vanadium",
  "zinc",
] as const;
type NutrientKey = (typeof NUTRIENT_KEYS)[number];
