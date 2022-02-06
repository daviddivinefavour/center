const userRoutes = require("./userRoutes");
const postRoutes = require('./postRoutes');

module.exports = (app) => {
  app.use("/api/v1", userRoutes);
  app.use("/api/v1", postRoutes);
};
