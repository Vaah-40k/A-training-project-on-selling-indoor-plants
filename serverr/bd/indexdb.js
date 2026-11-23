const Sequelize = require("sequelize");
const sequelize = new Sequelize("indoor_plants", "root", "", {
  dialect: "mysql",
  host: "localhost",
  logging: false,
});

const userModules = require("./modules/user")(sequelize);
const plugs = require("./modules/plugs")(sequelize);
const basket = require("./modules/basket")(sequelize);
const purchasesModules = require("./modules/purchases")(sequelize);

basket.belongsTo(plugs, { foreignKey: "id_plant" });
module.exports = {
  userModules,
  plugs,
  basket,
  purchasesModules,
};
