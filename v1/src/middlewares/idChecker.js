const mongoose = require("mongoose");
const ApiError = require("../errors/ApiError");

const idChecker = (field) => (req, res, next) => {
  // if (!req?.params[field || "id"]?.match(/^[0-9a-fA-F]{24}$/)) {
  if (!mongoose.Types.ObjectId.isValid(req?.params?.[field || "id"])) {
    return next(new ApiError("Invalid ID", 400));
  }
  next();
};

module.exports = idChecker;
