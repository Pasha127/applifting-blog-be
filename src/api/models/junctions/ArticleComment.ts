import { DataTypes } from "sequelize"
import sequelize from "../../../db"

const ArticleCommentModel = sequelize.define("articleComment", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  }
})

export default ArticleCommentModel