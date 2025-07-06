import { db } from "~/db/client";
import { desc, gte } from "drizzle-orm";
import { recents } from "~/db/schema";

export function recentsQuery() {
  const lastYear = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
  return db.query.recents.findMany({
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
    where: gte(recents.updatedAt, lastYear.toISOString()),
    orderBy: desc(recents.updatedAt),
  });
}

export type RecentsQueryType = Awaited<ReturnType<typeof recentsQuery>>;
