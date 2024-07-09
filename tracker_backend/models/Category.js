const mongoose = require("mongoose");

//* Schema
const categorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      default: "Uncategorized",
    },
    type: {
      type: String,
      required: true,
      enum: ["income", "expense"],
    },
  },
  {
    timestamps: true,
  }
);

//* Compile model based on schema and Export Module
module.exports = mongoose.model("Category", categorySchema);
