import { db } from "~/db/client";
import { recipeEntries } from "../schema";
import { eq } from "drizzle-orm";

export function recipeEntriesQuery(foodId: string) {
  return db.query.recipeEntries.findMany({
    where: eq(recipeEntries.recipeFoodId, foodId),
    with: {
      component: true,
    },
  });
}

export type RecipeEntriesQueryType = Awaited<
  ReturnType<typeof recipeEntriesQuery>
>;
