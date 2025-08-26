import { drizzle } from "drizzle-orm/node-postgres";
import * as auth from "./schema/auth";
import * as podcast from "./schema/podcast";

export const db = drizzle(process.env.DATABASE_URL || "", {
	schema: { ...auth, ...podcast },
});

export { auth, podcast };
