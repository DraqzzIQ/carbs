import { db } from "~/db/client";
import { asc } from "drizzle-orm";
import { foods } from "~/db/schema";

export function favoritesQuery() {
  return db.query.favorites.findMany({
    columns: {
      foodId: true,
      servingQuantity: true,
      amount: true,
      serving: true,
    },
    with: {
      food: {
        columns: {
          name: true,
          producer: true,
          energy: true,
        },
      },
    },
    orderBy: asc(foods.name),
  });
}

export type FavoritesQueryType = Awaited<ReturnType<typeof favoritesQuery>>;
