const Mongoose = require("mongoose");
const logger = require("../scripts/logger/Sections");

const SectionSchema = new Mongoose.Schema(
  {
    name: String,
    user_id: {
      type: Mongoose.Types.ObjectId,
      ref: "user",
    },
    project_id: {
      type: Mongoose.Types.ObjectId,
      ref: "project",
    },
    order: Number,
  },
  { timestamps: true, versionKey: false }
);

SectionSchema.post("save", (doc) => {
  logger.log({
    level: "info",
    message: doc,
  });
});

module.exports = Mongoose.model("section", SectionSchema);
