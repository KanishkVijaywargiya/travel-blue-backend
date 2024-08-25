import { ApiError } from "./ApiError.js";
import { User } from "../models/user.models.js";
import {
  validatePassword,
  validateRequiredFields,
} from "./validation/userRegisterValidations.js";

const passwordReset = async (userId, oldPassword, newPassword, res) => {
  try {
    // fetch user by userId
    const user = await User.findById(userId);
    if (!user) return new ApiError(404, "User not found").send(res);

    // check if old password is correct
    const isOldPasswordCorrect = await user.isPasswordCompare(oldPassword);

    if (!isOldPasswordCorrect)
      return new ApiError(400, "Incorrect old password").send(res);

    // update user password
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return true;
  } catch (error) {
    return new ApiError(500, error.message || "Error updating password").send(
      res
    );
  }
};

const fetchAllUsers = async (_, res) => {
  try {
    const users = await User.find();
    if (!users) return new ApiError(400, "No Users available").send(res);
    return users;
  } catch (error) {
    return new ApiError(500, "Error in fetching users").send(res);
  }
};

const checkUserStatus = async (user, res) => {
  try {
    if (!user) return new ApiError(401, "User not logged in").send(res);
    const userExists = await User.countDocuments();
    if (userExists === 0)
      return new ApiError(404, "Not a single user vailable").send(res);
    return userExists;
  } catch (error) {
    return new ApiError(500, "Error in fetching user").send(res);
  }
};

export { passwordReset, fetchAllUsers, checkUserStatus };
