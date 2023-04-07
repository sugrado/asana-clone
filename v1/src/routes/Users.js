const schemas = require("../validations/Users");
const validate = require("../middlewares/validate");
const express = require("express");
const {
  create,
  index,
  login,
  projectList,
  resetPassword,
  update,
  deleteUser,
  changePassword,
} = require("../controllers/Users");
const authenticateToken = require("../middlewares/authenticate");
const router = express.Router();

router.get("/", index);
router.route("/").post(validate(schemas.createValidation), create);
router
  .route("/")
  .patch(authenticateToken, validate(schemas.updateValidation), update);
router.route("/login").post(validate(schemas.loginValidation), login);
router.route("/projects").get(authenticateToken, projectList);
router
  .route("/reset-password")
  .post(validate(schemas.resetPasswordValidation), resetPassword);
router
  .route("/change-password")
  .post(
    authenticateToken,
    validate(schemas.changePasswordValidation),
    changePassword
  );
router.route("/:id").delete(authenticateToken, deleteUser);

module.exports = router;
