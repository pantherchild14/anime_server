const { resolve } = require("path");

const defaultRoutes = {
  login: "authentication",
  admin: "admin/home",
  auth: "apis/user",
  schedule: "apis/schedule",
  player: "apis/player",
  addDrive: "addDrive",
};

module.exports = (app) => {
  for (let route in defaultRoutes) {
    app.use(`/${route}`, require(resolve(`routes/${defaultRoutes[route]}`)));
  }
};
