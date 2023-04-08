const Joi = require("joi");

const createValidation = Joi.object({
  title: Joi.string().required().min(3),
  section_id: Joi.string().required().min(5),
  project_id: Joi.string().required().min(5),
  description: Joi.string().min(3),
  statuses: Joi.array(),
  order: Joi.number(),
  isCompleted: Joi.boolean(),
  comments: Joi.array(),
  due_date: Joi.date(),
  assigned_to: Joi.string().min(5),
});

const updateValidation = Joi.object({
  title: Joi.string().min(3),
  section_id: Joi.string().min(5),
  project_id: Joi.string().min(5),
  description: Joi.string().min(3),
  statuses: Joi.array(),
  project_id: Joi.string().min(5),
  order: Joi.number(),
  isCompleted: Joi.boolean(),
  comments: Joi.array(),
  due_date: Joi.date(),
  assigned_to: Joi.string().min(5),
});

const commentValidation = Joi.object({
  comment: Joi.string().min(3),
  _id: Joi.string().min(5),
  _destroy: Joi.boolean(),
});

module.exports = {
  createValidation,
  updateValidation,
  commentValidation,
};
