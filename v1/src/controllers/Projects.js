const httpStatus = require("http-status");
const projectService = require("../services/ProjectService");
const ApiError = require("../errors/ApiError");

class ProjectsController {
  index(req, res) {
    projectService
      .list()
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  }

  create(req, res) {
    req.body.user_id = req.user;
    projectService
      .create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send(response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  }

  update(req, res, next) {
    if (!req.params?.id)
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ message: "ID field is required" });

    projectService
      .update(req.body, req.params.id)
      .then((updatedProject) => {
        if (!updatedProject)
          /*throw new ApiError("Project not found", 404);*/
          return next(new ApiError("Project not found", 404));
        res.status(httpStatus.OK).send(updatedProject);
      })
      .catch((e) => {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Internal Server Error" });
      });
  }

  deleteProject(req, res) {
    if (!req.params?.id)
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ message: "ID field is required" });

    projectService
      .delete(req.params.id)
      .then((deletedProject) => {
        if (!deletedProject)
          return res
            .status(httpStatus.NOT_FOUND)
            .send({ message: "Project not found " });
        res.status(httpStatus.OK).send(deletedProject);
      })
      .catch((e) => {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Internal Server Error" });
      });
  }
}
module.exports = new ProjectsController();
