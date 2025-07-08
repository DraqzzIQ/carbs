import { db } from "~/db/client";
import { desc, eq, gte } from "drizzle-orm";
import { foods, recents } from "~/db/schema";

export function recentsQuery() {
  const lastYear = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
  return db
    .select({
      id: recents.id,
      foodId: recents.foodId,
      servingQuantity: recents.servingQuantity,
      amount: recents.amount,
      serving: recents.serving,
      updatedAt: recents.updatedAt,
      food: foods,
    })
    .from(recents)
    .innerJoin(foods, eq(foods.id, recents.foodId))
    .where(gte(recents.updatedAt, lastYear.toISOString()))
    .orderBy(desc(recents.updatedAt))
    .limit(100);
}

export type RecentsQueryType = Awaited<ReturnType<typeof recentsQuery>>;
