import { drizzle } from "drizzle-orm/expo-sqlite/driver";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";

const DATABASE_NAME = "food.db";
const expoDb = openDatabaseSync(DATABASE_NAME, {
  enableChangeListener: true,
});
export const db = drizzle(expoDb, { schema });
