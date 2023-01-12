import { jwtVerify } from "jose";
import { env } from "$env/dynamic/private";
const { SECRET } = env;
import bcrypt from "bcryptjs";
const { genSalt, hash } = bcrypt;

// @ts-ignore
const secret = new TextEncoder().encode(SECRET);

export async function verify_logged_in(token: string | undefined): Promise<boolean> {
	if (token === undefined) {
		return false;
	}
	const { payload } = await jwtVerify(token, secret).catch(() => {
		return { payload: null };
	});

	if (payload === null || payload.loggedIn === undefined) {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return payload.loggedIn;
}

export async function verify_token_user(token: string | undefined): Promise<number> {
	if (token === undefined) {
		throw "undefined";
	}

	const { payload } = await jwtVerify(token, secret).catch(() => {
		return { payload: null };
	});

	if (payload === null || payload.userId === undefined) {
		throw "not logged in";
	}

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return parseInt(payload.userId.toString());
}

export async function hash_password(password: string): Promise<string> {
	const salt = await genSalt(10);
	return (await hash(password, salt)).toString();
}
