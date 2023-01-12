import type { PageServerLoad } from "./$types";

import { rdr_to_login } from "$lib/server/utilities";

export const load: PageServerLoad = async ({ cookies, locals }) => {
	await cookies.delete("token");

	locals.loggedInAdmin = false;

	rdr_to_login();
};
