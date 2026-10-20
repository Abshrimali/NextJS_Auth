import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },

    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    // Forgot password
    forgotPasswordToken: {
      type: String,
      default: undefined,
    },

    forgotPasswordTokenExpiry: {
      type: Date,
      default: undefined,
    },

    // Email verification
    verifyToken: {
      type: String,
      default: undefined,
    },

    verifyTokenExpiry: {
      type: Date,
      default: undefined,
    },
  },
  { timestamps: true },
);

export const User = mongoose.models.users || mongoose.model("users", userSchema);
