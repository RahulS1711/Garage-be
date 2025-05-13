const mongoose = require("mongoose");
const { constant } = require("../static/constant");
const AdminSchema = new mongoose.Schema(
  {
    branch_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
      },
    ],
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [constant.ADMIN_ROLE.ADMIN, constant.ADMIN_ROLE.SUPERADMIN],
      default: "admin",
    },
    status: {
      type: String,
      enum: [
        constant.USER_STATUS.PENDING,
        constant.USER_STATUS.ACTIVE,
        constant.USER_STATUS.INACTIVE,
      ],
      default: constant.USER_STATUS.PENDING,
    },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

AdminSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

AdminSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

const AdminModel = mongoose.model("adminUser", AdminSchema);

module.exports = AdminModel;
