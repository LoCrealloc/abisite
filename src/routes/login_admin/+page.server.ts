import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
const { SECRET } = env;
import { error } from "@sveltejs/kit";

import { Setting } from "$lib/server/models/setting";

import { SignJWT } from "jose";

import bcrypt from "bcryptjs";
const { compare } = bcrypt;

import { rdr_to_home } from "$lib/server/utilities";

const jwt_alg = "HS256";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const secret = new TextEncoder().encode(SECRET);

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get("token");

	if (token !== undefined) {
		rdr_to_home();
	}
};

import type { Actions } from "@sveltejs/kit";
import { dev } from "$app/environment";

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();

		const admin_model = await Setting.findOne({
			where: {
				key: "ADMIN_PASSWORD",
			},
			attributes: ["value"],
		});

		if (admin_model !== null) {
			const admin_hash = admin_model.get("value");
			const password = data.get("password");

			if (!password) {
				throw error(400, {
					message: "No password provided",
				});
			} else if (typeof password !== "string") {
				throw error(401, {
					message: "Invalid password",
				});
			}

			if (!(await compare(password.toString(), admin_hash))) {
				throw error(401, {
					message: "Wrong password",
				});
			}
		}

		const jwt = await new SignJWT({ loggedIn: true })
			.setProtectedHeader({ alg: jwt_alg })
			.setExpirationTime("5d")
			.sign(secret);

		cookies.set("token", jwt.toString(), {
			path: "/admin",
			sameSite: "strict",
			secure: !dev,
			maxAge: 60 * 60 * 24 * 5,
		});

		rdr_to_home();
	},
};
