import { db } from "~/db/client";
import { desc } from "drizzle-orm";
import { recents } from "~/db/schema";

export function frequentsQuery() {
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
    orderBy: desc(recents.count),
    limit: 50,
  });
}

export type FrequentsQueryType = Awaited<ReturnType<typeof frequentsQuery>>;
