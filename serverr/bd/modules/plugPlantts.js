const { DataTypes } = require("sequelize");
module.exports = function (sequelize) {
  return sequelize.define(
    "plugPlantts",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.STRING,
      },

      category: {
        type: DataTypes.STRING,
      },
      img: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "plugPlantts",
      timestamps: false,
    },
  );
};
