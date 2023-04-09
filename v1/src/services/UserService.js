const BaseService = require("./BaseService");
const BaseModel = require("../models/Users");

class UserService extends BaseService {
  constructor() {
    super(BaseModel);
  }

  loginUser(loginData) {
    return BaseModel.findOne(loginData);
  }
}

module.exports = new UserService();
