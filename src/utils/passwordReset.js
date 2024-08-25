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

export { passwordReset };
