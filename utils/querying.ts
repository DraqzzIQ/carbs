import { MealType } from "~/types/MealType";
import { yazioGetFoodDetails } from "~/api/yazio";
import { FoodDetailsDto, ServingDto } from "~/api/types/FoodDetails";
import { db } from "~/db/client";
import { favorites, Food, foods, meals, recents, streaks } from "~/db/schema";
import { and, eq, isNull, like } from "drizzle-orm";
import { isBaseUnit } from "~/utils/formatting";
import { inArray } from "drizzle-orm/sql/expressions/conditions";
import { FoodSearchResultDto } from "~/api/types/FoodSearchResultDto";

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
  date: string,
  food: Food | undefined = undefined,
): Promise<boolean> {
  if (food === undefined) {
    food = await getAndSaveFood(foodId);
    if (food === undefined) {
      console.error(`Couldn't add Product with ID ${foodId}.`);
      return false;
    }
  }

  await updateStreak(date);
  await updateOrAddRecent(foodId, servingQuantity, amount, serving);

  try {
    await db.insert(meals).values({
      foodId: food.id,
      servingQuantity: servingQuantity,
      amount: amount,
      serving: serving,
      mealType: meal,
      date: date,
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
    return new Date(recent!.updatedAt) >= lastYear;
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
  } catch (error) {
    console.error(`Error deleting custom food with ID ${foodId}:`, error);
  }
}

export async function queryCustomFoods(
  query: string,
  barCode: boolean = false,
): Promise<FoodSearchResultDto[]> {
  if (query.length < 2) {
    return [];
  }
  try {
    const result = await db.query.foods.findMany({
      where: and(
        eq(foods.isCustom, true),
        isNull(foods.deletedAt),
        barCode
          ? like(foods.eans, `%${query}%`)
          : like(foods.name, `%${query}%`),
      ),
      limit: 5,
    });
    return result.map((food) => ({
      score: 200,
      name: food.name,
      productId: food.id,
      serving: food.servings?.[0]?.serving ?? "",
      servingQuantity: 1,
      amount: food.servings?.[0]?.amount ?? 0,
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
    }));
  } catch (error) {
    console.error("Error querying custom foods:", error);
    return [];
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

async function updateStreak(date: string) {
  try {
    const existingStreak = await db.query.streaks.findFirst({
      where: eq(streaks.day, date),
    });

    if (!existingStreak) {
      await db.insert(streaks).values({ day: date });
    }
  } catch (error) {
    console.error(`Error updating streak for date ${date}:`, error);
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
