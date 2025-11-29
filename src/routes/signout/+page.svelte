<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { authClient } from "$lib/auth-client";
    import { goto } from "$app/navigation";

    const handleLogout = async () => {
        await authClient.signOut();
        await goto("/");
    };
</script>

<Button onclick={handleLogout}>Sign Out</Button>
