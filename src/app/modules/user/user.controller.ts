import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import httpStatus from "http-status";
import { IJwtPayload } from "../auth/auth.interface";

import { AuthService } from "../auth/auth.service";

const createUser = catchAsync(async (req, res) => {
  const userData = req.body;
  const result = await AuthService.register(userData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const createadmin = catchAsync(async (req, res) => {
  const result = await UserServices.createadminIntoDB({
    ...req.body,
    role: "admin",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "admin is created succesfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved succesfully",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await UserServices.updateUserIntoDB(userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated succesfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await UserServices.deleteUserFromDB(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is deleted successfully",
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const user = req.user as unknown as IJwtPayload;
  const result = await UserServices.getUserById(user.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile retrieved successfully",
    data: result,
  });
});

export const UserControllers = {
  createUser,
  createadmin,
  getAllUsers,
  getMe,
  updateUser,
  deleteUser,
};
