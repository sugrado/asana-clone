const schemas = require("../validations/Projects");
const validate = require("../middlewares/validate");
const express = require("express");
const authenticateToken = require("../middlewares/authenticate");
const router = express.Router();
const projectsController = require("../controllers/Projects");

router.route("/").get(authenticateToken, projectsController.index);
router
  .route("/")
  .post(
    authenticateToken,
    validate(schemas.createValidation),
    projectsController.create
  );
router
  .route("/:id")
  .patch(
    authenticateToken,
    validate(schemas.updateValidation),
    projectsController.update
  );
router
  .route("/:id")
  .delete(authenticateToken, projectsController.deleteProject);

module.exports = router;
