const schemas = require("../validations/Sections");
const validate = require("../middlewares/validate");
const express = require("express");
const {
  create,
  deleteSection,
  index,
  update,
} = require("../controllers/Sections");
const authenticateToken = require("../middlewares/authenticate");
const router = express.Router();

router.route("/:projectId").get(authenticateToken, index);
router
  .route("/")
  .post(authenticateToken, validate(schemas.createValidation), create);
router
  .route("/:id")
  .patch(authenticateToken, validate(schemas.updateValidation), update);
router.route("/:id").delete(authenticateToken, deleteSection);

module.exports = router;
