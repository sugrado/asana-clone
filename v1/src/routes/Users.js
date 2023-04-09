const schemas = require("../validations/Users");
const validate = require("../middlewares/validate");
const express = require("express");
const UsersController = require("../controllers/Users");
const authenticateToken = require("../middlewares/authenticate");
const router = express.Router();

router.get("/", UsersController.index);
router
  .route("/")
  .post(validate(schemas.createValidation), UsersController.create);
router
  .route("/")
  .patch(
    authenticateToken,
    validate(schemas.updateValidation),
    UsersController.update
  );
router
  .route("/login")
  .post(validate(schemas.loginValidation), UsersController.login);
router.route("/projects").get(authenticateToken, UsersController.projectList);
router
  .route("/reset-password")
  .post(
    validate(schemas.resetPasswordValidation),
    UsersController.resetPassword
  );
router
  .route("/change-password")
  .post(
    authenticateToken,
    validate(schemas.changePasswordValidation),
    UsersController.changePassword
  );
router
  .route("/update-profile-image")
  .post(authenticateToken, UsersController.updateProfileImage);
router.route("/:id").delete(authenticateToken, UsersController.deleteUser);

module.exports = router;
