const Project = require("../models/Projects");

const insert = (data) => {
  const project = Project(data);
  return project.save();
};

const list = (where) => {
  return Project.find(where || {}).populate({
    path: "user_id",
    select: "full_name email",
  });
};

const modify = (data, id) => {
  return Project.findByIdAndUpdate(id, data, { new: true });
};

module.exports = {
  insert,
  list,
  modify,
};
