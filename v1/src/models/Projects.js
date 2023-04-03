const Mongoose = require("mongoose");
const logger = require("../scripts/logger/Projects");

const ProjectSchema = new Mongoose.Schema(
  {
    name: String,
    user_id: {
      type: Mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true, versionKey: false }
);

ProjectSchema.post("save", (doc) => {
  logger.log({
    level: "info",
    message: doc,
  });
});

module.exports = Mongoose.model("project", ProjectSchema);
