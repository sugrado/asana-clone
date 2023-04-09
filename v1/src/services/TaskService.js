const BaseService = require("./BaseService");
const BaseModel = require("../models/Tasks");

class TaskService extends BaseService {
  constructor() {
    super(BaseModel);
  }

  read(where, expand) {
    if (!expand) return this.BaseModel.findOne(where);
    return this.BaseModel.findOne(where).populate([
      {
        path: "user_id",
        select: "full_name email profile_image",
      },
      {
        path: "comments",
        populate: {
          path: "user_id",
          select: "full_name email profile_image",
        },
      },
      {
        path: "sub_tasks",
        select:
          "title description, isCompleted, assigned_to due_date order sub_tasks statuses",
      },
    ]);
  }

  list(where) {
    return this.BaseModel.find(where || {})
      .populate({
        path: "user_id",
        select: "full_name email profile_image",
      })
      .populate({
        path: "project_id",
        select: "name",
      });
  }
}

module.exports = new TaskService();
