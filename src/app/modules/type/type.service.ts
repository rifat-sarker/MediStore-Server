import QueryBuilder from "../../builder/QueryBuilder";
import { IImageFile } from "../../interface/IImageFile";
import { IJwtPayload } from "../auth/auth.interface";
import { USER_ROLE } from "../user/user.interface";
import httpStatus from "http-status";
import Medicine from "../medicine/medicine.model";
import { IType } from "./type.interface";
import { Type } from "./type.model";
import AppError from "../../errors/AppError";

const createType = async (
  typeData: Partial<IType>,
  logo: IImageFile,
  authUser: IJwtPayload
) => {
  if (logo && logo.path) {
    typeData.logo = logo.path;
  }

  const type = new Type({
    ...typeData,
    createdBy: authUser.userId,
  });

  const result = await type.save();

  return result;
};

const getAllType = async (query: Record<string, unknown>) => {
  const typeQuery = new QueryBuilder(Type.find(), query)
    .search(["name"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await typeQuery.modelQuery;
  const meta = await typeQuery.countTotal();

  return {
    meta,
    result,
  };
};

const updateTypeIntoDB = async (
  id: string,
  payload: Partial<IType>,
  file: IImageFile,
  authUser: IJwtPayload
) => {
  const isTypeExist = await Type.findById(id);
  if (!isTypeExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Type not found!");
  }

  if (
    authUser.role === USER_ROLE.customer &&
    isTypeExist.createdBy.toString() !== authUser.userId
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are not able to edit the category!"
    );
  }

  if (file && file.path) {
    payload.logo = file.path;
  }

  const result = await Type.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

const deleteTypeIntoDB = async (id: string, authUser: IJwtPayload) => {
  const isTypeExist = await Type.findById(id);
  if (!isTypeExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Type not found!");
  }

  if (
    authUser.role === USER_ROLE.customer &&
    isTypeExist.createdBy.toString() !== authUser.userId
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are not able to delete the type!"
    );
  }

  const product = await Medicine.findOne({ type: id });
  if (product)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can not delete the type. Because the type is related to products."
    );

  const deletedType = await Type.findByIdAndDelete(id);
  return deletedType;
};

export const TypeService = {
  createType,
  getAllType,
  updateTypeIntoDB,
  deleteTypeIntoDB,
};
