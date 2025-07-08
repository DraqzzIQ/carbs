import { db } from "~/db/client";
import { desc, eq, gte } from "drizzle-orm";
import { foods, recents } from "~/db/schema";

export function frequentsQuery() {
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
    .where(gte(recents.count, 3))
    .orderBy(desc(recents.count))
    .limit(100);
}

export type FrequentsQueryType = Awaited<ReturnType<typeof frequentsQuery>>;
