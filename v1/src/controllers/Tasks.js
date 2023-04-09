const taskService = require("../services/TaskService");
const httpStatus = require("http-status");

const index = (req, res) => {
  if (!req?.params?.projectId)
    return res.status(httpStatus.BAD_REQUEST).send({
      error: "Project id is required.",
    });

  taskService
    .list({ projectId: req.params.projectId })
    .then((response) => {
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const create = (req, res) => {
  req.body.user_id = req.user;
  taskService
    .create(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const update = (req, res) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "Id is required",
    });
  }
  taskService
    .update(req.body, req.params?.id)
    .then((updatedDoc) => {
      res.status(httpStatus.OK).send(updatedDoc);
    })
    .catch((e) =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Internal Server Error" })
    );
};

const deleteTask = (req, res) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "Id is required",
    });
  }
  taskService
    .delete(req.params?.id)
    .then((deletedDoc) => {
      if (!deletedDoc) {
        res.status(httpStatus.NOT_FOUND).send({
          message: "Task not found",
        });
      }
      res.status(httpStatus.OK).send({
        message: "Task deleted",
      });
    })
    .catch((e) =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Internal Server Error" })
    );
};

const makeComment = async (req, res) => {
  try {
    taskService.read({ _id: req.params.id }).then((mainTask) => {
      if (!mainTask)
        return res.status(httpStatus.NOT_FOUND).send({
          message: "Task not found",
        });

      const comment = {
        ...req.body,
        commented_at: new Date(),
        user_id: req.user,
      };
      mainTask.comments.push(comment);
      mainTask.save().then((updatedDoc) => {
        return res.status(httpStatus.OK).send(updatedDoc);
      });
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: "Internal Server Error" });
  }
};

const deleteComment = async (req, res) => {
  try {
    taskService.read({ _id: req.params.id }).then((mainTask) => {
      if (!mainTask)
        return res.status(httpStatus.NOT_FOUND).send({
          message: "Task not found",
        });

      mainTask.comments = mainTask.comments.filter(
        (comment) => comment._id.toString() !== req.params.commentId
      );
      mainTask.save().then((updatedDoc) => {
        return res.status(httpStatus.OK).send(updatedDoc);
      });
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: "Internal Server Error" });
  }
};

const addSubTask = async (req, res) => {
  if (!req.params.id)
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "Id is required",
    });
  try {
    taskService.read({ _id: req.params.id }).then((mainTask) => {
      if (!mainTask)
        return res.status(httpStatus.NOT_FOUND).send({
          message: "Task not found",
        });

      taskService.create({ ...req.body, user_id: req.user }).then((subTask) => {
        mainTask.sub_tasks.push(subTask);
        mainTask.save().then((updatedDoc) => {
          return res.status(httpStatus.OK).send(updatedDoc);
        });
      });
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: "Internal Server Error" });
  }
};

const fetchTask = async (req, res) => {
  if (!req.params.id)
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "Id is required",
    });
  try {
    taskService.read({ _id: req.params.id }, true).then((task) => {
      if (!task)
        return res.status(httpStatus.NOT_FOUND).send({
          message: "Task not found",
        });

      return res.status(httpStatus.OK).send(task);
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: "Internal Server Error" });
  }
};

module.exports = {
  create,
  index,
  update,
  deleteTask,
  makeComment,
  deleteComment,
  addSubTask,
  fetchTask,
};
