const schemas = require("../validations/Projects");
const validate = require("../middlewares/validate");
const express = require("express");
const {
  create,
  deleteProject,
  index,
  update,
} = require("../controllers/Projects");
const authenticateToken = require("../middlewares/authenticate");
const router = express.Router();

router.route("/").get(authenticateToken, index);
router
  .route("/")
  .post(authenticateToken, validate(schemas.createValidation), create);
router
  .route("/:id")
  .patch(authenticateToken, validate(schemas.updateValidation), update);
router.route("/:id").delete(authenticateToken, deleteProject);

module.exports = router;
