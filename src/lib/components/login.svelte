<script lang="ts">
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Checkbox } from "$lib/components/ui/checkbox";
    import * as Card from "$lib/components/ui/card";
    import { authClient } from "$lib/auth-client";
    import { Loader } from "lucide-svelte";
    import { toast } from "svelte-sonner";
    import { Turnstile } from "svelte-turnstile";
    import { env } from "$env/dynamic/public";

    let email = "";
    let password = "";
    let loading = false;
    let rememberMe = false;
    let turnstileToken = "";

    function handleTurnstile(e: CustomEvent) {
        turnstileToken = e.detail.token;
    }
    function handleTurnstileExpired() {
        turnstileToken = "";
    }

    async function handleSignIn() {
        if (!turnstileToken) {
            toast.error("Please complete the captcha verification");
            return;
        }

        const returnUrl = page.url.searchParams.get("return_to") || "/";

        await authClient.signIn.email({
            email,
            password,
            rememberMe,
            callbackURL: returnUrl,
            fetchOptions: {
                onRequest: () => {
                    loading = true;
                },
                onResponse: () => {
                    loading = false;
                },
                onSuccess: async () => {
                    toast.success("Logged in successfully!");
                    const returnTo = page.url.searchParams.get("return_to") || "/";
                    await goto(returnTo, { invalidateAll: true });
                },
                onError: (ctx: any) => {
                    toast.error(ctx.error?.message || "Failed to sign in");
                },
                headers: {
                    "x-captcha-response": turnstileToken
                }
            }
        });
    }
</script>

<Card.Root class="w-full">
    <Card.Header>
        <Card.Title class="text-lg md:text-xl">Sign In</Card.Title>
        <Card.Description class="text-xs md:text-sm">
            Enter your email below to login to your account
        </Card.Description>
    </Card.Header>
    <Card.Content>
        <div class="grid gap-4">
            <div class="grid gap-2">
                <Label for="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    required
                    bind:value={email}
                />
            </div>

            <div class="grid gap-2">
                <div class="flex items-center">
                    <Label for="password">Password</Label>
                    <a href="/forgot-password" class="ml-auto inline-block text-sm underline">
                        Forgot your password?
                    </a>
                </div>

                <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    autocomplete="current-password"
                    bind:value={password}
                />
            </div>

            <div class="flex items-center gap-2">
                <Checkbox id="remember" bind:checked={rememberMe} />
                <Label for="remember">Remember me</Label>
            </div>

            <Turnstile
                siteKey={env.PUBLIC_TURNSTILE_SITE_KEY}
                theme="auto"
                size="flexible"
                on:callback={handleTurnstile}
                on:expired={handleTurnstileExpired}
            />

            <Button type="submit" class="w-full" disabled={loading} onclick={handleSignIn}>
                {#if loading}
                    <Loader size={16} class="animate-spin" />
                {:else}
                    <p>Login</p>
                {/if}
            </Button>
        </div>
    </Card.Content>

    <Card.Footer>
        <a href="/signup" class="ml-auto text-sm underline hover:text-primary">
            Not registered? Sign up now!
        </a>
    </Card.Footer>
</Card.Root>
