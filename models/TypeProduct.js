const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = require("./Sequelize");

class TypeProduct extends Model {}

TypeProduct.init(
  {
    type_product: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "type_Product",
    tableName: "type_product",
    timestamps:false
  }
);
module.exports = TypeProduct;