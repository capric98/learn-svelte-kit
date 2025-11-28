import { betterAuth } from "better-auth";
import { createAuthClient } from "better-auth/svelte";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";

export const auth = betterAuth({
    // ... your config
    plugins: [sveltekitCookies(getRequestEvent)] // make sure this is the last plugin in the array
});

export const authClient = createAuthClient({});
