import { db } from "~/db/client";
import { asc, eq, sql } from "drizzle-orm";
import { favorites, foods } from "~/db/schema";

export function favoritesQuery() {
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
    .orderBy(
      asc(sql`lower (
    ${foods.name}
    )`),
    );
}

export type FavoritesQueryType = Awaited<ReturnType<typeof favoritesQuery>>;
