const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    branch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
    DeleteAt: { type: Date, default: null },
  },
  { timestamps: true }
);

ServiceSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

ServiceSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

const ServiceModel = mongoose.model("Service", ServiceSchema);

module.exports = ServiceModel;
