import { db } from "~/db/client";
import { and, desc, eq, gte, isNull, not } from "drizzle-orm";
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
    .where(
      and(
        gte(recents.count, 3),
        not(eq(foods.category, "quick-entry")),
        isNull(foods.deletedAt),
        not(foods.isRecipe),
      ),
    )
    .orderBy(desc(recents.count))
    .limit(1000);
}

export type FrequentsQueryType = ReturnType<typeof frequentsQuery>;
