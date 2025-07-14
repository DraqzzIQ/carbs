import { db } from "~/db/client";
import { eq } from "drizzle-orm";
import { meals } from "~/db/schema";

export function mealQuery(mealId: number) {
  return db.query.meals.findFirst({
    columns: {
      foodId: false,
    },
    where: eq(meals.id, mealId),
    with: {
      food: true,
    },
  });
}

export type MealQueryType = Awaited<ReturnType<typeof mealQuery>>;
