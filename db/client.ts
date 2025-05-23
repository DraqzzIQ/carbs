import {drizzle} from "drizzle-orm/expo-sqlite/driver";
import {openDatabaseSync} from "expo-sqlite";

const DATABASE_NAME = 'food.db';
const expoDb = openDatabaseSync(DATABASE_NAME, {enableChangeListener: true});
export const db = drizzle(expoDb);