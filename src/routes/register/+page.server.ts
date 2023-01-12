import type { Actions } from "@sveltejs/kit";

import { User } from "$lib/server/models/user";
import { error, redirect } from "@sveltejs/kit";
import { SignJWT } from "jose";
import { dev } from "$app/environment";

import { env } from "$env/dynamic/private";
const { SECRET } = env;

import { validateGender } from "$lib/client/utils";

const jwt_alg = "HS256";
// @ts-ignore
const secret = new TextEncoder().encode(SECRET);

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();

		const code = data.get("code");
		const email = data.get("email");
		const gender = data.get("gender");

		if (email === null || code === null || gender === null) {
			throw error(404, "incomplete request");
		}

		const gender_str = gender.toString();

		if (!validateGender(gender_str)) {
			throw error(404, "incorrect gender input");
		}

		const user = await User.findOne({
			attributes: ["id", "mail"],
			where: { code: code.toString() },
		});

		if (user === null) {
			throw error(401, "wrong code");
		}

		if (user.dataValues.mail !== null) {
			throw error(409, "already registered");
		}

		const newUser = {
			mail: email.toString(),
			gender: gender_str,
		};

		await User.update(newUser, { where: { id: user.id } });

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
