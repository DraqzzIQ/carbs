import { db } from "~/db/client";
import { eq, sql } from "drizzle-orm";
import { foods, meals } from "~/db/schema";

export function mealQuery(mealId: number) {
  const food = db.query.meals.findFirst({
    columns: {
      foodId: false,
    },
    where: eq(meals.id, mealId),
    with: {
      food: true,
    },
  });

  // (async () => {
  //   const foodResolved = await food;
  //   const rows: { vitaminA: number; name: string }[] = await db
  //     .select({ vitaminA: foods.vitaminA, name: foods.name })
  //     .from(foods);
  //   console.log("test");
  //   console.log(
  //     await db.$client.getFirstAsync(`select vitamin_a, name from foods`),
  //   );
  //   console.log("test2");
  //   // console.log(await db.query.foods.findMany());
  // })();

  return food;
}

export type MealQueryType = Awaited<ReturnType<typeof mealQuery>>;
