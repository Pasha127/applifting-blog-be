import { DataTypes } from "sequelize"
import sequelize from "../../../db"

const CommentVoteModel = sequelize.define("commentVote", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {notEmpty: true}
},
})

export default CommentVoteModel