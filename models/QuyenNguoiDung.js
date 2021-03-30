const { Sequelize, Model, DataTypes } = require("sequelize");
const Nguoi_dung = require("./Nguoi_dung");
const sequelize = require('./Sequelize')
class QuyenNguoiDung extends Model {}

QuyenNguoiDung.init(
  {
    id:{
      primaryKey:true,
      type:DataTypes.NUMBER,
      autoIncrement:true
    },
    ten_quan_tri:DataTypes.STRING
  },
  {
    sequelize,
    modelName: "quyen-nguoi-dung",
    tableName: "quyen_nguoi_dung",
    timestamps: false,
  }
);

QuyenNguoiDung.hasMany(Nguoi_dung, {
  foreignKey: "id_quyen",
  as: "quyen",
});
Nguoi_dung.belongsTo(QuyenNguoiDung,{

  foreignKey: "id_quyen",
  as: "quyen",
})


module.exports = QuyenNguoiDung;
