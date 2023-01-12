import type { PageServerLoad } from "./$types";
import type { Actions } from "@sveltejs/kit";
import { randomBytes } from "crypto";
import { User } from "$lib/server/models/user";
import { AnswerPossibility } from "$lib/server/models/answerpossibility";
import { Person } from "$lib/server/models/person";

interface inPerson {
	id?: number;
	forename: string;
	surname: string;
}

interface inUser {
	id?: number;
	mail?: string;
	gender?: "m" | "w" | "d";
	code: string;
	personId: number | null;
}

export const load: PageServerLoad = async () => {
	const data = (
		await User.findAll({
			include: Person,
			attributes: ["id", "mail", "gender", "code", "personId", "Person.forename", "Person.surname"],
		})
	).map((value) => {
		return value.dataValues;
	});

	return {
		users: data.map((row) => {
			return {
				id: row.id,
				mail: row.mail,
				gender: row.gender,
				code: row.code,
				personId: row.personId,
				// @ts-ignore
				forename: row.Person.forename,
				// @ts-ignore
				surname: row.Person.surname,
			};
		}),
	};
};

export const actions: Actions = {
	users: async ({ request }) => {
		// fetch user ids to check what needs to be deleted later
		const user_ids = (
			await User.findAll({
				attributes: ["id"],
			})
		).map((user) => {
			return user.dataValues.id;
		});

		const data = await request.formData();

		const processed: Array<number> = [];

		let current_user: inUser = {
			id: undefined,
			personId: null,
			code: "",
		};

		let current_person: inPerson = {
			id: undefined,
			forename: "",
			surname: "",
		};

		async function processEntry() {
			if (current_person.forename !== "") {
				let person;
				if (current_person.id === undefined) {
					person = await Person.create(current_person);
				} else {
					await Person.update(current_person, { where: { id: current_person.id } });
					person = current_person;
				}

				// @ts-ignore
				current_user.personId = person.id;

				if (current_user.id === undefined) {
					await User.create(current_user);
				} else {
					await User.update(current_user, {
						where: {
							id: current_user.id,
						},
					});
					processed.push(current_user.id);
				}
			}
		}

		for (const pair of data.entries()) {
			const key = pair[0];
			const value = pair[1];

			if (key === "forename") {
				await processEntry();

				current_user = {
					id: undefined,
					personId: null,
					code: "",
				};

				current_person = {
					id: undefined,
					forename: "",
					surname: "",
				};

				current_person.forename = value.toString();
			} else if (key === "surname") {
				current_person.surname = value.toString();
			} else if (key === "id") {
				current_user.id = parseInt(value.toString());
			} else if (key === "personId") {
				current_person.id = parseInt(value.toString());
			} else if (key === "code") {
				let code = value.toString();
				if (code == "---") {
					code = randomBytes(4).toString("hex").toUpperCase();
				}
				current_user.code = code;
			}
		}

		await processEntry();

		const removables: Array<number> = [];

		user_ids.forEach((number) => {
			if (!processed.includes(number)) {
				removables.push(number);
			}
		});

		await User.destroy({ where: { id: removables } });
	},
	generate: async () => {
		const possibilities = (
			await AnswerPossibility.findAll({
				include: Person,
				attributes: ["id", "personId"],
				where: {
					isTeacher: false,
				},
			})
		).map((value) => {
			return value.dataValues;
		});

		for (const possibility of possibilities) {
			await User.findOrCreate({
				where: { personId: possibility.personId },
				defaults: {
					code: randomBytes(4).toString("hex").toUpperCase(),
				},
			});
		}
	},
};
