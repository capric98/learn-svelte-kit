import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { BETTER_AUTH_DB_URL } from "$env/static/private";

const pg_client = postgres(BETTER_AUTH_DB_URL, { prepare: false });

export const db = drizzle(pg_client);
