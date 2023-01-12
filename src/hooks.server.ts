import type { Handle } from "@sveltejs/kit";
import { verify_logged_in, hash_password, verify_token_user } from "$lib/server/handleAuth";
import { db } from "$lib/server/database";

// import to load the models for db sync
import { User } from "$lib/server/models/user";
import { Setting } from "$lib/server/models/setting";
import { X } from "$lib/server/models/associations"; // Load associations
const x = new X();
x.log();

import { env } from "$env/dynamic/private";
const { DEFAULT_ADMIN_PASSWORD } = env;

import { building } from "$app/environment";

async function db_setup() {
	await db.sync();

	const configs = await Setting.findAll();
	if (configs.length > 0) {
		return;
	}

	const initial_config = [
		{
			key: "ADMIN_PASSWORD",
			value: await hash_password(DEFAULT_ADMIN_PASSWORD),
		},
	];

	for (let i = 0; i < initial_config.length; i++) {
		await Setting.create(initial_config[i]);
	}
}

function redirect(body: string, location: string) {
	return new Response(body, {
		status: 303,
		headers: { location },
	});
}

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith("/admin")) {
		const token = event.cookies.get("token");
		if (!(await verify_logged_in(token))) {
			return redirect("Not logged in", "/login_admin");
		}

		event.locals.loggedInAdmin = true;
	} else {
		const isLoginRoute =
			event.url.pathname.startsWith("/login") || event.url.pathname.startsWith("/register");

		const token = event.cookies.get("usersession");
		let userId;

		try {
			userId = await verify_token_user(token);
		} catch {
			return !isLoginRoute ? redirect("not logged in", "/login") : resolve(event);
		}
		if ((await User.findOne({ where: { id: userId } })) === null) {
			return !isLoginRoute ? redirect("no user", "/login") : resolve(event);
		}

		event.locals.userId = userId;
	}

	return resolve(event);
};

if (!building) {
	// workaround for building failure; discussed here: https://github.com/sveltejs/kit/issues/7899
	await db_setup();
}
