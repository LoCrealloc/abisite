import { Question } from "$lib/server/models/question";
import type { PageServerLoad } from "./$types";
import { AnswerPossibility } from "$lib/server/models/answerpossibility";
import { Person } from "$lib/server/models/person";
import { Answer } from "../../lib/server/models/answer";
import type { Actions } from "@sveltejs/kit";
import { PairAnswer } from "../../lib/server/models/pairanswer";

export const load: PageServerLoad = async ({ locals }) => {
	const possibilities = (
		await AnswerPossibility.findAll({
			include: Person,
			attributes: ["id", "isTeacher", "personId", "Person.forename", "Person.surname"],
		})
	).map((value) => {
		return value.dataValues;
	});

	return {
		possibilities: possibilities.map((row) => {
			return {
				id: row.id,
				isTeacher: row.isTeacher,
				personId: row.personId,
				// @ts-ignore
				forename: row.Person.forename,
				// @ts-ignore
				surname: row.Person.surname,
			};
		}),
		questions: (
			await Question.findAll({
				attributes: ["id", "question", "teacherQuestion", "pair"],
				order: [["question", "ASC"]],
			})
		).map((question) => {
			return question.dataValues;
		}),
		answers: (
			await Answer.findAll({
				attributes: ["id", "questionId", "answerPossibilityId"],
				where: {
					userId: locals.userId,
				},
			})
		).map((answer) => {
			return answer.dataValues;
		}),
		pairanswers: (
			await PairAnswer.findAll({
				attributes: ["id", "questionId", "answerOneId", "answerTwoId"],
				where: {
					userId: locals.userId,
				},
			})
		).map((answer) => {
			return answer.dataValues;
		}),
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();

		let current_answer: number | undefined;
		let current_possibility: number | undefined;
		let current_possibility_two: number | undefined;

		async function processEntry(id: number) {
			if (current_possibility === undefined) {
				return;
			}

			const question = await Question.findOne({ where: { id: id } });

			if (question !== null && !question.pair) {
				if (current_answer === undefined) {
					await Answer.create({
						questionId: id,
						answerPossibilityId: current_possibility,
						userId: locals.userId,
					});
				} else {
					await Answer.update(
						{ answerPossibilityId: current_possibility },
						{ where: { id: current_answer, userId: locals.userId } },
					);
				}
			} else {
				if (current_answer === undefined) {
					if (current_possibility === current_possibility_two) {
						return;
					}

					await PairAnswer.create({
						questionId: id,
						answerOneId: current_possibility,
						answerTwoId: current_possibility_two,
						userId: locals.userId,
					});
				} else {
					await PairAnswer.update(
						{
							answerOneId: current_possibility,
							answerTwoId: current_possibility_two,
						},
						{
							where: { id: current_answer, userId: locals.userId },
						},
					);
				}
			}
		}

		for (const pair of data.entries()) {
			const key = pair[0];
			const value = pair[1];

			if (key === "questionId") {
				await processEntry(parseInt(value.toString()));

				current_answer = undefined;
				current_possibility = undefined;
				current_possibility_two = undefined;
			} else if (key === "answerId") {
				current_answer = parseInt(value.toString());
			} else if (key === "answerPossibilityId" || key === "answerOneId") {
				current_possibility = parseInt(value.toString());
			} else if (key === "answerTwoId") {
				current_possibility_two = parseInt(value.toString());
			}
		}
	},
};
