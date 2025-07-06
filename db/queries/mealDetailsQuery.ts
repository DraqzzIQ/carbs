import { MealType } from "~/types/MealType";
import { db } from "~/db/client";
import { meals } from "../schema";
import { and, eq } from "drizzle-orm";

export function mealDetailsQuery(day: string, mealType?: MealType) {
  return db.query.meals.findMany({
    columns: {
      id: true,
      servingQuantity: true,
      amount: true,
      mealType: true,
      date: true,
      serving: true,
    },
    where: and(
      eq(meals.date, day),
      mealType !== undefined ? eq(meals.mealType, mealType) : undefined,
    ),
    with: {
      food: true,
    },
  });
}

export type MealDetailsQueryType = Awaited<ReturnType<typeof mealDetailsQuery>>;
