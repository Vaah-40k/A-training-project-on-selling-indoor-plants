const { DataTypes } = require("sequelize");
module.exports = function (sequelize) {
  return sequelize.define(
    "plants",
    {
      id_plant: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      type: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.FLOAT,
      },

      description: {
        type: DataTypes.STRING,
      },

      light: {
        type: DataTypes.STRING,
      },
      watering: {
        type: DataTypes.STRING,
      },
      humidity: {
        type: DataTypes.STRING,
      },
      temperature: {
        type: DataTypes.STRING,
      },
      url_link: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "plants",
      timestamps: false,
    },
  );
};
