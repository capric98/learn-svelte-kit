// DON'T IMPORT THIS FILE IN THE CLIENT SIDE CODE

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "$lib/database/db";

import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";

import * as authSchema from "$lib/database/auth-schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: authSchema
    }),
    plugins: [sveltekitCookies(getRequestEvent)], // make sure this is the last plugin in the array
    emailAndPassword: { enabled: true }
});
