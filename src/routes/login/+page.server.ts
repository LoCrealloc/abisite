import type { Actions } from "@sveltejs/kit";

import { User } from "$lib/server/models/user";
import { SignJWT } from "jose";
import { dev } from "$app/environment";

import { env } from "$env/dynamic/private";
const { SECRET } = env;
import { error, redirect } from "@sveltejs/kit";

const jwt_alg = "HS256";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const secret = new TextEncoder().encode(SECRET);

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();

		const email = data.get("email");
		const code = data.get("code");

		if (email === null || code == null) {
			throw error(404, "incomplete request");
		}

		const user = await User.findOne({
			attributes: ["mail", "id", "code"],
			where: { mail: email.toString() },
		});

		if (user === null || user.dataValues.code !== code) {
			throw error(401, "wrong code");
		}

		const jwt = await new SignJWT({ userId: user.dataValues.id })
			.setProtectedHeader({ alg: jwt_alg })
			.setExpirationTime("1d")
			.sign(secret);

		cookies.set("usersession", jwt.toString(), {
			path: "/",
			sameSite: "strict",
			secure: !dev,
			maxAge: 60 * 60 * 24,
		});

		throw redirect(302, "/");
	},
};
