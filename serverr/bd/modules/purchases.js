const { DataTypes } = require("sequelize");
module.exports = function (sequelize) {
  return sequelize.define(
    "purchases",
    {
      id_purchases: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      id_user: {
        type: DataTypes.INTEGER,
      },
      plants_data: {
        type: DataTypes.TEXT("long"),
      },
      status: {
        type: DataTypes.STRING,
      },
      total_sum: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "purchases",
    },
  );
};
