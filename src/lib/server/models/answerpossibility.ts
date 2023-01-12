import { Model, DataTypes } from "sequelize";
import type {
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	ForeignKey,
} from "sequelize";
import { db } from "../database";

import type { Person } from "./person";

export class AnswerPossibility extends Model<
	InferAttributes<AnswerPossibility>,
	InferCreationAttributes<AnswerPossibility>
> {
	declare id: CreationOptional<number>;
	declare isTeacher: boolean;
	declare personId: ForeignKey<Person["id"]> | null;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

AnswerPossibility.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		isTeacher: DataTypes.BOOLEAN,
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	},
	{
		sequelize: db,
		tableName: "answerpossibilities",
	},
);
