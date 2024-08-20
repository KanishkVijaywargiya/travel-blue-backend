import { ApiError } from "./ApiError.js";
import { User } from "../models/user.models.js";

// Step - 3. user already exists or not
const checkUserExists = async ({ username, email }) => {
  const userExists = await User.findOne({ $or: [{ username, email }] });
  console.log("userExists", userExists);
  if (userExists) {
    throw new ApiError(
      409,
      `User with this ${username} or ${email} already exists`
    );
  }
};

export { checkUserExists };
