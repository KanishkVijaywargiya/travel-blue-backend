import { ApiError } from "../errorHandling/ApiError.js";
import { User } from "../../models/user.models.js";

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

export { checkUserExists, fetchAllUsers, checkUserStatus };
