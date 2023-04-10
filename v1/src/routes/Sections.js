const schemas = require("../validations/Sections");
const validate = require("../middlewares/validate");
const express = require("express");
const SectionsController = require("../controllers/Sections");
const authenticateToken = require("../middlewares/authenticate");
const router = express.Router();
const idChecker = require("../middlewares/idChecker");

router
  .route("/:projectId")
  .get(idChecker("projectId"), authenticateToken, SectionsController.index);
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
    idChecker(),
    authenticateToken,
    validate(schemas.updateValidation),
    SectionsController.update
  );
router
  .route("/:id")
  .delete(idChecker(), authenticateToken, SectionsController.deleteSection);

module.exports = router;
