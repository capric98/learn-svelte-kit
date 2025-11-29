<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { authClient } from "$lib/auth-client";
    import type { PageData } from "./$types";

    export let data: PageData;
    const session = authClient.useSession();
</script>

{#if data.user || $session.data}
    <h1>Welcome back, {data.user?.name || $session.data?.user.name}!</h1>

    <p>
        Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
    </p>

    <Button
        onclick={async () => {
            await authClient.signOut();
            window.location.reload();
        }}
    >
        Sign Out
    </Button>
{:else}
    <h1>Welcome to SvelteKit</h1>
    <p>
        Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
    </p>
    <Button href="/login">Login</Button>
{/if}
