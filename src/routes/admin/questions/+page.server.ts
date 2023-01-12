import type { PageServerLoad } from "./$types";
import { Question } from "$lib/server/models/question";

interface inQuestion {
	question: string;
	teacherQuestion: boolean;
	id?: number;
	pair: boolean;
}

export const load: PageServerLoad = async () => {
	return {
		questions: (
			await Question.findAll({
				attributes: ["id", "question", "teacherQuestion", "pair"],
			})
		).map((question) => {
			return question.dataValues;
		}),
	};
};

import type { Actions } from "./$types";

export const actions: Actions = {
	default: async ({ request }) => {
		// fetch question ids to check what needs to be deleted later
		const question_ids = (
			await Question.findAll({
				attributes: ["id"],
			})
		).map((question) => {
			return question.dataValues.id;
		});

		const data = await request.formData();

		const result = [];
		let current: inQuestion = {
			question: "",
			teacherQuestion: false,
			pair: false,
		};

		for (const pair of data.entries()) {
			const key = pair[0];
			const value = pair[1];

			if (key === "question") {
				if (current.question !== "") {
					result.push(current);
				}

				current = {
					question: "",
					teacherQuestion: false,
					pair: false,
				};

				current.question = value.toString();
			} else if (key === "teacherQuestion") {
				current.teacherQuestion = true;
			} else if (key === "id") {
				current.id = parseInt(value.toString());
			} else if (key === "pair") {
				current.pair = true;
			}
		}

		if (current.question !== "") {
			result.push(current);
		}

		const with_id: Array<inQuestion> = [];
		const without_id: Array<inQuestion> = [];

		const in_ids: Array<number> = [];

		result.forEach((question) => {
			if (Object.hasOwn(question, "id") && question.id != undefined) {
				with_id.push(question);
				in_ids.push(question.id);
			} else {
				without_id.push(question);
			}
		});

		await Question.bulkCreate(without_id);

		for (let i = 0; i < with_id.length; i++) {
			const question = with_id[i];

			await Question.update(question, { where: { id: question.id } });
		}

		const removables: Array<number> = [];

		question_ids.forEach((number) => {
			if (!in_ids.includes(number)) {
				removables.push(number);
			}
		});

		await Question.destroy({ where: { id: removables } });
	},
};
