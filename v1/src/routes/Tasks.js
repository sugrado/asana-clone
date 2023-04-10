const express = require("express");
const TasksController = require("../controllers/Tasks");
const schemas = require("../validations/Tasks");
const validate = require("../middlewares/validate");
const authenticateToken = require("../middlewares/authenticate");
const idChecker = require("../middlewares/idChecker");

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
    idChecker(),
    authenticateToken,
    validate(schemas.updateValidation),
    TasksController.update
  );
router
  .route("/:id")
  .delete(idChecker(), authenticateToken, TasksController.deleteTask);
router
  .route("/:id/make-comment")
  .post(
    idChecker(),
    authenticateToken,
    validate(schemas.commentValidation),
    TasksController.makeComment
  );
router
  .route("/:id/:commentId")
  .delete(idChecker(), authenticateToken, TasksController.deleteComment);
router
  .route("/:id/add-sub-task")
  .post(
    idChecker(),
    validate(schemas.createValidation),
    authenticateToken,
    TasksController.addSubTask
  );
router
  .route("/:id")
  .get(idChecker(), authenticateToken, TasksController.fetchTask);
router.route("/").get(authenticateToken, TasksController.index);

module.exports = router;
