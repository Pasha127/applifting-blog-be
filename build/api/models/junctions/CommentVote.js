import { DataTypes } from "sequelize";
import sequelize from "../../../db.js";
const CommentVoteModel = sequelize.define("commentVote", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { notEmpty: true } //check to see it is not empty
    },
});
export default CommentVoteModel;
