import { MealType } from "~/types/MealType";
import { yazioGetProductDetails } from "~/api/yazio";
import { ProductDetails } from "~/api/types/ProductDetails";
import { db } from "~/db/client";
import { foods, meals, servings, streaks } from "~/db/schema";
import { and, eq } from "drizzle-orm";

export async function removeMealProduct(mealId: number) {
  try {
    await db.delete(meals).where(and(eq(meals.id, mealId)));
  } catch (error) {
    console.error(`Error removing meal with ID ${mealId}:`, error);
  }
}

export async function addProductToMeal(
  meal: MealType,
  productId: string,
  servingQuantity: number,
  amount: number,
  serving: string,
  date: string,
  food: ProductDetails | undefined = undefined,
) {
  if (food === undefined) {
    food = (await yazioGetProductDetails(productId)) ?? undefined;
  }
  if (food === undefined) {
    console.error(`Couldn't add Product with ID ${productId}.`);
    return;
  }

  await updateStreak(date);
  await addOrUpdateProduct(food);
  try {
    await db.insert(meals).values({
      foodId: food.id,
      servingQuantity,
      amount,
      serving: serving,
      mealType: meal,
      date: date,
    });
  } catch (error) {
    console.error(
      `Error adding product to meal: ${meal}, product ID: ${productId}`,
      error,
    );
  }
}

async function addOrUpdateProduct(food: ProductDetails) {
  try {
    const existingProduct = !!(await db.query.foods.findFirst({
      columns: { id: true },
      where: eq(foods.id, food.id),
    }));

    if (!existingProduct) {
      await db
        .insert(foods)
        .values({ ...getProductProperties(food), id: food.id });
      await insertServings(food.id, food.servings);
      return;
    }

    const updatedAt = await db.query.foods.findFirst({
      columns: { updatedAt: true },
      where: eq(foods.id, food.id),
    });
    if (updatedAt?.updatedAt === food.updated_at) {
      return;
    }
    await db.update(foods).set(getProductProperties(food));
    await db.delete(servings).where(eq(servings.foodId, food.id));
    await insertServings(food.id, food.servings);
  } catch (error) {
    console.error(
      `Error adding or updating product with ID ${food.id}:`,
      error,
    );
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

async function insertServings(
  foodId: string,
  foodServings: { serving: string; amount: number }[],
) {
  try {
    await db.insert(servings).values([
      {
        foodId: foodId,
        serving: "100-serving",
        amount: 100,
      },
      ...foodServings.map((serving) => ({
        foodId: foodId,
        serving: serving.serving,
        amount: serving.amount,
      })),
    ]);
  } catch (error) {
    console.error(
      `Error inserting servings for product with ID ${foodId}:`,
      error,
    );
  }
}

function getProductProperties(food: ProductDetails): {
  updatedAt: string | null;
  isCustom: boolean;
  isVerified: boolean;
  name: string;
  producer: string | null;
  baseUnit: string;
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
    name: food.name,
    producer: food.producer,
    baseUnit: food.base_unit,
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
