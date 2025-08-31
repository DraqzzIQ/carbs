import { db } from "~/db/client";
import { and, asc, eq, not, sql } from "drizzle-orm";
import { favorites, foods } from "~/db/schema";

export function favoritesQuery(excludeRecipes = false) {
  return db
    .select({
      id: favorites.id,
      foodId: favorites.foodId,
      servingQuantity: favorites.servingQuantity,
      amount: favorites.amount,
      serving: favorites.serving,
      updatedAt: favorites.updatedAt,
      food: foods,
    })
    .from(favorites)
    .innerJoin(foods, eq(foods.id, favorites.foodId))
    .where(and(excludeRecipes ? not(foods.isRecipe) : undefined))
    .orderBy(
      asc(sql`lower (
    ${foods.name}
    )`),
    );
}

export type FavoritesQueryType = ReturnType<typeof favoritesQuery>;
