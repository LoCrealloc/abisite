import { AnswerPossibility } from "./answerpossibility";
import { Answer } from "./answer";
import { PairAnswer } from "./pairanswer";
import { Question } from "./question";
import { Person } from "./person";
import { User } from "./user";

Person.hasOne(User, { foreignKey: "personId" });
User.belongsTo(Person, { foreignKey: "personId" });

Person.hasOne(AnswerPossibility, { foreignKey: "personId" });
AnswerPossibility.belongsTo(Person, { foreignKey: "personId" });

AnswerPossibility.hasMany(Answer, { foreignKey: "answerPossibilityId" });
Answer.belongsTo(AnswerPossibility, { foreignKey: "answerPossibilityId" });

AnswerPossibility.hasMany(PairAnswer, { foreignKey: "answerOneId", as: "answerOneMany" });
PairAnswer.belongsTo(AnswerPossibility, { foreignKey: "answerOneId", as: "answerOneOne" });

AnswerPossibility.hasMany(PairAnswer, { foreignKey: "answerTwoId", as: "answerTwoMany" });
PairAnswer.belongsTo(AnswerPossibility, { foreignKey: "answerTwoId", as: "answerTwoOne" });

Question.hasOne(Answer, { foreignKey: "questionId" });
Answer.belongsTo(Question, { foreignKey: "questionId" });

Question.hasOne(PairAnswer, { foreignKey: "questionId" });
PairAnswer.belongsTo(Question, { foreignKey: "questionId" });

User.hasOne(Answer, { foreignKey: "userId" });
Answer.belongsTo(User, { foreignKey: "userId" });

User.hasOne(PairAnswer, { foreignKey: "userId" });
PairAnswer.belongsTo(User, { foreignKey: "userId" });

export class X {
	log() {
		// eslint-disable-next-line no-console
		console.log("Associations loaded");
	}
}
