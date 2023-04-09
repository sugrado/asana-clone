const schemas = require("../validations/Sections");
const validate = require("../middlewares/validate");
const express = require("express");
const SectionsController = require("../controllers/Sections");
const authenticateToken = require("../middlewares/authenticate");
const router = express.Router();

router.route("/:projectId").get(authenticateToken, SectionsController.index);
router
  .route("/")
  .post(
    authenticateToken,
    validate(schemas.createValidation),
    SectionsController.create
  );
router
  .route("/:id")
  .patch(
    authenticateToken,
    validate(schemas.updateValidation),
    SectionsController.update
  );
router
  .route("/:id")
  .delete(authenticateToken, SectionsController.deleteSection);

module.exports = router;
