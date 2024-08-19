import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    watchHistory: [{ type: Schema.Types.ObjectId, ref: "Video" }],
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // helps for searching
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true, // helps for searching
    },
    avatar: { type: String, required: true }, //cloudinary URL
    coverImage: { type: String }, //cloudinary URL
    password: { type: String, required: [true, "Password is required"] },
    refreshToken: { type: String },
  },
  { timestamps: true } //can be use to get createdAt & UpdatedAt
);

// perform this middleware mongoose hook for password before saving it.
// we are encrypting the password before saving
// this should only run when we are saving password field, it should not trigger while saving other fields.
// as there is one problem, if same user came nxt time to just change the avatar or cover img.
// This pre hook will trigger before saving & password will get encrypt again n again
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hash(this.password, 10);
  next();
});
// so that's we have applied a -ve check as well.
// if password field is not modified then come out of pre function
// if password field is modified then only come in pre function

// this method is use to compare user entered password with bcrypt password before saving
userSchema.methods.isPasswordCorrect = async function (password) {
  // password: user entered password; this.password: encrypted password by bcrypt
  return await bcrypt.compare(password, this.password);
};

// generating access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// generating refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

export const User = mongoose.model("User", userSchema);
