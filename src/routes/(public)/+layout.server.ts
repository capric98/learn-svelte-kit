import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
// return_to

export const load: LayoutServerLoad = async ({ cookies, url }) => {
    // 1. Check if the user is authenticated (populated by hooks.server.ts)
    if (!cookies.get('user')) {
        // 2. If not, redirect to login
        // We include the current path as a parameter so we can redirect them back later
        const fromUrl = url.pathname + url.search;
        throw redirect(303, `/login?return_to=${fromUrl}`);
    }

    // 3. If authenticated, pass the user data to the page
    return {
        user: cookies.get('user')
    };
};