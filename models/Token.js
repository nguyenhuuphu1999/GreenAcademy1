const { Sequelize, Model, DataTypes } = require("sequelize");
const Nguoi_dung = require("./Nguoi_dung");
const sequelize = require("./Sequelize");
class Token extends Model {}

Token.init(
  {
    user_id: DataTypes.NUMBER,
    created_date: DataTypes.DATE,
    expireted_date: DataTypes.DATE,
    type_token: DataTypes.NUMBER,
    token: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "token",
    tableName: "token",
    timestamps: false,
  }
);
Nguoi_dung.hasMany(Token, {
    foreignKey: "id",
    as: "token_user",
});
Token.belongsTo(Nguoi_dung, {
  foreignKey: "user_id",

});
module.exports = Token;
