import { ApiError } from "./ApiError.js";
import { User } from "../models/user.models.js";

// Step - 3. user already exists or not
const checkUserExists = async ({ username, email }, res) => {
  const userExists = await User.findOne({ $or: [{ username, email }] });
  if (userExists) {
    return new ApiError(
      409,
      `User with this Username: ${username} or Email: ${email} already exists`
    ).send(res);

    // throw new ApiError(
    //   409,
    //   `User with this ${username} or ${email} already exists`
    // );
  }
};

export { checkUserExists };
