import { IAdmin } from "../admin/admin.interface";
import { IUser } from "./user.interface";
// import User from "./user.model";



const createUserIntoDB = async (userData: IUser) => {
  // const result = await User.create(userData);
  // return result;
};

const createadminIntoDB = async (userData: IAdmin) => {
  // const result = await User.create(userData);
  // return result;
};

const getAllUsersFromDB = async () => {
  // const result = await User.find();
  // return result;
};

const updateUserIntoDB = async (id: string, payload: Partial<IUser>) => {
  // const result = await User.findByIdAndUpdate(id, payload);
  // return result;
};

const deleteUserFromDB = async (id: string) => {
  // const result = await User.findByIdAndDelete(id);
  // return result;
};

export const UserServices = {
  createUserIntoDB,
  createadminIntoDB,
  getAllUsersFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
};
