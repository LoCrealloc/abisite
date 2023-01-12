import { redirect } from "@sveltejs/kit";

export const rdr_to_login = () => {
	throw redirect(302, "/login_admin");
};

export const rdr_to_home = () => {
	throw redirect(302, "/admin");
};
