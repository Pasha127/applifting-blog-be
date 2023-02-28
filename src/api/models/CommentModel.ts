import { DataTypes } from "sequelize"
import curses from "badwords-list";
import sequelize from "../../db";

const CommentModel = sequelize.define("comment", {
    commentId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Anonymous",
      validate: {notEmpty: true,not: curses.regex}
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {notEmpty: true,not: curses.regex}
    },
    userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
  })

  export default CommentModel