<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Loader } from "lucide-svelte";
    import { authClient } from "$lib/auth-client";
    import { toast } from "svelte-sonner";
    import { goto } from "$app/navigation";
    import { Turnstile } from "svelte-turnstile";
    import { env } from "$env/dynamic/public";

    let firstName = "";
    let lastName = "";
    let email = "";
    let password = "";
    let passwordConfirmation = "";
    let turnstileToken = "";
    let loading = false;

    function handleTurnstile(e: CustomEvent) {
        turnstileToken = e.detail.token;
    }
    function handleTurnstileExpired() {
        turnstileToken = "";
    }

    async function handleSignUp() {
        if (password !== passwordConfirmation) {
            toast.error("Passwords do not match");
            return;
        }

        if (!turnstileToken) {
            toast.error("Please complete the captcha verification");
            return;
        }

        await authClient.signUp.email({
            email,
            password,
            name: `${firstName} ${lastName}`,
            callbackURL: "/",
            fetchOptions: {
                onRequest: () => {
                    loading = true;
                },
                onResponse: () => {
                    loading = false;
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                },
                onSuccess: async () => {
                    goto("/");
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
        <Card.Title class="text-lg md:text-xl">Sign Up</Card.Title>
        <Card.Description class="text-xs md:text-sm">
            Enter your information to create an account
        </Card.Description>
    </Card.Header>
    <Card.Content>
        <div class="grid gap-4">
            <div class="grid grid-cols-2 gap-4">
                <div class="grid gap-2">
                    <Label for="first-name">First name</Label>
                    <Input
                        id="first-name"
                        placeholder="First name"
                        required
                        bind:value={firstName}
                    />
                </div>
                <div class="grid gap-2">
                    <Label for="last-name">Last name</Label>
                    <Input id="last-name" placeholder="Last name" required bind:value={lastName} />
                </div>
            </div>

            <div class="grid gap-2">
                <Label for="email">Email</Label>
                <Input id="email" type="email" placeholder="Email" required bind:value={email} />
            </div>

            <div class="grid gap-2">
                <Label for="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    bind:value={password}
                    autocomplete="new-password"
                    placeholder="Password"
                />
            </div>

            <div class="grid gap-2">
                <Label for="password_confirmation">Confirm Password</Label>
                <Input
                    id="password_confirmation"
                    type="password"
                    bind:value={passwordConfirmation}
                    autocomplete="new-password"
                    placeholder="Confirm Password"
                />
            </div>

            <Turnstile
                siteKey={env.PUBLIC_TURNSTILE_SITE_KEY}
                theme="auto"
                size="flexible"
                on:callback={handleTurnstile}
                on:expired={handleTurnstileExpired}
            />

            <Button type="submit" class="w-full" disabled={loading} onclick={handleSignUp}>
                {#if loading}
                    <Loader size={16} class="animate-spin" />
                {:else}
                    Create an account
                {/if}
            </Button>
        </div>
    </Card.Content>
</Card.Root>
