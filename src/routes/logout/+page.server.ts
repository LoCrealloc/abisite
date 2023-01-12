import type { PageServerLoad } from "./$types";

import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ cookies, locals }) => {
	await cookies.delete("usersession");

	locals.userId = null;

	throw redirect(302, "/login");
};
