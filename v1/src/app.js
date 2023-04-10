const express = require("express");
const fileUpload = require("express-fileupload");
const helmet = require("helmet");
const config = require("./config");
const loaders = require("./loaders");
const {
  ProjectRoutes,
  UserRoutes,
  SectionRoutes,
  TaskRoutes,
} = require("./routes");
const events = require("./scripts/events");
const path = require("path");
const errorHandler = require("./middlewares/errorHandler");

config();
loaders();
events();

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(helmet());
app.use(fileUpload());

app.listen(process.env.APP_PORT, () => {
  console.log("SERVER RUNNING ON :" + process.env.APP_PORT);
  app.use("/projects", ProjectRoutes);
  app.use("/users", UserRoutes);
  app.use("/sections", SectionRoutes);
  app.use("/tasks", TaskRoutes);

  app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  });

  app.use(errorHandler);
});
