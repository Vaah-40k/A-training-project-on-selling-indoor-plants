const Sequelize = require("sequelize");
const sequelize = new Sequelize("indoor_plants", "root", "", {
  dialect: "mysql",
  host: "localhost",
  logging: false,
});

const userModules = require("./modules/user")(sequelize);
const plugPlantts = require("./modules/plugPlantts")(sequelize);
module.exports = {
  userModules,
  plugPlantts,
};
