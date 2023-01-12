import { Model, DataTypes } from "sequelize";
import type {
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	ForeignKey,
} from "sequelize";
import { db } from "../database";
import type { Question } from "./question";
import type { AnswerPossibility } from "./answerpossibility";
import type { User } from "./user";

export class PairAnswer extends Model<
	InferAttributes<PairAnswer>,
	InferCreationAttributes<PairAnswer>
> {
	declare id: CreationOptional<number>;
	declare userId: ForeignKey<User["id"]>;
	declare questionId: ForeignKey<Question["id"]>;
	declare answerOneId: ForeignKey<AnswerPossibility["id"]>;
	declare answerTwoId: ForeignKey<AnswerPossibility["id"]>;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

PairAnswer.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	},
	{
		sequelize: db,
		tableName: "pairanswers",
	},
);
