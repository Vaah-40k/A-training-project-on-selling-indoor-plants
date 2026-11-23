const { DataTypes } = require("sequelize");
module.exports = function (sequelize) {
  return sequelize.define(
    "basket",
    {
      id_basket: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      id_user: {
        type: DataTypes.INTEGER,
      },
      id_plant: {
        type: DataTypes.INTEGER,
      },
      count_plant: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "basket",
      timestamps: false,
    },
  );
};
