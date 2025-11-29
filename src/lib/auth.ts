// DON'T IMPORT THIS FILE IN THE CLIENT SIDE CODE

import { betterAuth } from "better-auth";
import { captcha } from "better-auth/plugins";

import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "$lib/database/db";

import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";

import * as authSchema from "$lib/database/auth-schema";

import { TURNSTILE_SECRET_KEY } from "$env/static/private";

export const auth = betterAuth({
    emailAndPassword: { enabled: true },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: authSchema
    }),
    plugins: [
        captcha({
            provider: "cloudflare-turnstile", // or google-recaptcha, hcaptcha, captchafox
            secretKey: TURNSTILE_SECRET_KEY
        }),
        sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
    ]
});
