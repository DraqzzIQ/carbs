import { db } from "~/db/client";
import { and, asc, eq, isNull, not, sql } from "drizzle-orm";
import { foods } from "~/db/schema";

export function customQuery(excludeRecipes = false) {
  return db
    .select({
      id: foods.id,
      foodId: foods.id,
      updatedAt: foods.updatedAt,
      food: foods,
    })
    .from(foods)
    .where(
      and(
        eq(foods.isCustom, true),
        isNull(foods.deletedAt),
        not(eq(foods.category, "quick-entry")),
        excludeRecipes ? not(foods.isRecipe) : undefined,
      ),
    )
    .orderBy(
      asc(sql`lower (
    ${foods.name}
    )`),
    );
}

export type CustomQueryType = ReturnType<typeof customQuery>;
