import { Model, DataTypes } from "sequelize";
import type {
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	ForeignKey,
} from "sequelize";
import { db } from "../database";

import type { gender } from "$lib/common_types";
import type { Person } from "./person";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	declare id: CreationOptional<number>;
	declare gender?: gender;
	declare mail?: string;
	declare code: string;
	declare personId: ForeignKey<Person["id"]> | null;

	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		mail: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		gender: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		code: DataTypes.STRING,
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	},
	{
		sequelize: db,
		tableName: "users",
	},
);
