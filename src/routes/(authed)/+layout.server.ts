import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
// return_to

export const load: LayoutServerLoad = async ({ locals, url }) => {
    if (!locals.user) {
        const fromUrl = url.pathname + url.search;
        throw redirect(303, `/login?return_to=${fromUrl}`);
    }

    // 3. If authenticated, pass the user data to the page
    return {
        user: locals.user
    };
};
