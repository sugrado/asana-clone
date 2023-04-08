const express = require("express");
const TasksController = require("../controllers/Tasks");
const schemas = require("../validations/Tasks");
const validate = require("../middlewares/validate");
const authenticateToken = require("../middlewares/authenticate");

const router = express.Router();

router
  .route("/")
  .post(
    validate(schemas.createValidation),
    authenticateToken,
    TasksController.create
  );
router
  .route("/:id")
  .patch(
    authenticateToken,
    validate(schemas.updateValidation),
    TasksController.update
  );
router.route("/:id").delete(authenticateToken, TasksController.deleteTask);
router
  .route("/:id/make-comment")
  .post(
    authenticateToken,
    validate(schemas.commentValidation),
    TasksController.makeComment
  );
router
  .route("/:id/:commentId")
  .delete(authenticateToken, TasksController.deleteComment);
router
  .route("/:id/add-sub-task")
  .post(
    validate(schemas.createValidation),
    authenticateToken,
    TasksController.addSubTask
  );
router.route("/:id").get(authenticateToken, TasksController.fetchTask);

module.exports = router;
