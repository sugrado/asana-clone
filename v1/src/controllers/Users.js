const {
  passwordToHash,
  generateAccessToken,
  generateRefreshToken,
} = require("../scripts/utils/helper");
const {
  insert,
  list,
  loginUser,
  modify,
  remove,
} = require("../services/Users");
const httpStatus = require("http-status");
const projectService = require("../services/Projects");
const uuid = require("uuid");
const eventEmitter = require("../scripts/events/eventEmitter");
const path = require("path");

const create = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  insert(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const login = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  loginUser(req.body)
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
};

const index = (req, res) => {
  list()
    .then((response) => {
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const projectList = (req, res) => {
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
};

const resetPassword = (req, res) => {
  const newPassword = uuid.v4()?.split("-")[0] || `usr-${new Date().getTime()}`;
  modify({ email: req.body.email }, { password: passwordToHash(newPassword) })
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
};

const update = (req, res) => {
  modify({ _id: req.user?._id }, req.body)
    .then((updatedUser) => {
      res.status(httpStatus.OK).send(updatedUser);
    })
    .catch((e) => {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Internal Server Error" });
    });
};

const deleteUser = (req, res) => {
  if (!req.params?.id)
    return res
      .status(httpStatus.NOT_FOUND)
      .send({ message: "ID field is required" });

  remove(req.params.id)
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
};

const changePassword = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  modify({ _id: req.user?._id }, req.body)
    .then((updatedUser) => {
      res.status(httpStatus.OK).send(updatedUser);
    })
    .catch((e) => {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Internal Server Error" });
    });
};

const updateProfileImage = (req, res) => {
  if (!req?.files?.profile_image) {
    return res.status(httpStatus.BAD_REQUEST).send({ error: "File required" });
  }
  const fileExtension = path.extname(req.files.profile_image.name);
  const fileName = `${uuid.v4().replace(/-/g, "")}${fileExtension}`;
  const folderPath = path.join(__dirname, "../", "uploads/users", fileName);
  req.files.profile_image.mv(folderPath, (err) => {
    if (err)
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Internal Server Error" });
    modify({ _id: req.user?._id }, { profile_image: fileName })
      .then((updatedUser) => {
        res.status(httpStatus.OK).send(updatedUser);
      })
      .catch((e) =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Internal Server Error" })
      );
  });
};

module.exports = {
  create,
  index,
  login,
  projectList,
  resetPassword,
  update,
  deleteUser,
  changePassword,
  updateProfileImage,
};
