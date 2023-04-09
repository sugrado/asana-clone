const {
  passwordToHash,
  generateAccessToken,
  generateRefreshToken,
} = require("../scripts/utils/helper");
const httpStatus = require("http-status");
const projectService = require("../services/ProjectService");
const uuid = require("uuid");
const eventEmitter = require("../scripts/events/eventEmitter");
const path = require("path");
const userService = require("../services/UserService");

class UsersController {
  create(req, res) {
    req.body.password = passwordToHash(req.body.password);
    userService
      .create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send(response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  }

  login(req, res) {
    req.body.password = passwordToHash(req.body.password);
    userService
      .loginUser(req.body)
      .then((user) => {
        if (!user)
          return res
            .status(httpStatus.NOT_FOUND)
            .send({ message: "User not found" });

        user = user.toObject();
        delete user.password;
        delete user.createdAt;
        delete user.updatedAt;

        user = {
          ...user,
          tokens: {
            access_token: generateAccessToken({ name: user.email, ...user }),
            refresh_token: generateRefreshToken({ name: user.email, ...user }),
          },
        };

        res.status(httpStatus.OK).send(user);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  }

  index(req, res) {
    userService
      .list()
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  }

  projectList(req, res) {
    req.user?._id;
    projectService
      .list({ user_id: req.user?._id })
      .then((projects) => {
        res.status(httpStatus.OK).send(projects);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
          error: "Internal Server Error",
        });
      });
  }

  resetPassword(req, res) {
    const newPassword =
      uuid.v4()?.split("-")[0] || `usr-${new Date().getTime()}`;
    userService
      .updateWhere(
        { password: passwordToHash(newPassword) },
        { email: req.body.email }
      )
      .then((updatedUser) => {
        if (!updatedUser)
          return res
            .status(httpStatus.NOT_FOUND)
            .send({ error: "User not found!" });
        eventEmitter.emit("send_email", {
          to: updatedUser.email,
          subject: "Reset Password",
          html: `Your password has been reset at your request.<br/>
          Don't forget to change your password after login.<br/>
          Your new Password: <b>${newPassword}</b>`,
        });
        res.status(httpStatus.OK).send({
          message:
            "We have sent the required information to your registered e-mail address to reset the password.",
        });
      })
      .catch((e) => {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Internal Server Error" });
      });
  }

  update(req, res) {
    userService
      .update(req.body, req.user?._id)
      .then((updatedUser) => {
        res.status(httpStatus.OK).send(updatedUser);
      })
      .catch((e) => {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Internal Server Error" });
      });
  }

  deleteUser(req, res) {
    if (!req.params?.id)
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ message: "ID field is required" });

    userService
      .delete(req.params.id)
      .then((deletedUser) => {
        if (!deletedUser)
          return res
            .status(httpStatus.NOT_FOUND)
            .send({ message: "User not found " });
        res.status(httpStatus.OK).send(deletedUser);
      })
      .catch((e) => {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Internal Server Error" });
      });
  }

  changePassword(req, res) {
    req.body.password = passwordToHash(req.body.password);
    userService
      .update(req.body, req.user?._id)
      .then((updatedUser) => {
        res.status(httpStatus.OK).send(updatedUser);
      })
      .catch((e) => {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Internal Server Error" });
      });
  }

  updateProfileImage(req, res) {
    if (!req?.files?.profile_image) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ error: "File required" });
    }
    const fileExtension = path.extname(req.files.profile_image.name);
    const fileName = `${uuid.v4().replace(/-/g, "")}${fileExtension}`;
    const folderPath = path.join(__dirname, "../", "uploads/users", fileName);
    req.files.profile_image.mv(folderPath, (err) => {
      if (err)
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Internal Server Error" });
      userService
        .update({ profile_image: fileName }, req.user?._id)
        .then((updatedUser) => {
          res.status(httpStatus.OK).send(updatedUser);
        })
        .catch((e) =>
          res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .send({ error: "Internal Server Error" })
        );
    });
  }
}

module.exports = new UsersController();
