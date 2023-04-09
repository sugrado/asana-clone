class BaseService {
  constructor(model) {
    this.BaseModel = model;
  }

  list(where) {
    return this.BaseModel?.find(where || {});
  }

  create(data) {
    return new this.BaseModel(data).save();
  }

  read(where) {
    return this.BaseModel.findOne(where);
  }

  update(data, id) {
    return this.BaseModel.findByIdAndUpdate(id, data, { new: true });
  }

  updateWhere(data, where) {
    return this.BaseModel.findOneAndUpdate(where, data, { new: true });
  }

  delete(id) {
    return this.BaseModel.findByIdAndDelete(id);
  }
}

module.exports = BaseService;
