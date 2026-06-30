import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { IImageFile } from "../../interface/IImageFile";
import { IJwtPayload } from "../auth/auth.interface";

const createCategory = async (
  categoryData: any,
  icon: IImageFile,
  authUser: IJwtPayload
) => {
  const result = await prisma.category.create({
    data: {
      name: categoryData.name,
      imageUrl: icon?.path || null,
    },
  });

  return result;
};

const getAllCategory = async (query: Record<string, unknown>) => {
  const categories = await prisma.category.findMany();
  
  return {
    meta: {
      total: categories.length,
    },
    result: categories,
  };
};

const updateCategoryIntoDB = async (
  id: string,
  payload: any,
  file: IImageFile,
  authUser: IJwtPayload
) => {
  const isCategoryExist = await prisma.category.findUnique({ where: { id } });
  
  if (!isCategoryExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found!");
  }

  if (file && file.path) {
    payload.imageUrl = file.path;
  }

  const result = await prisma.category.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deleteCategoryIntoDB = async (id: string, authUser: IJwtPayload) => {
  const isCategoryExist = await prisma.category.findUnique({ where: { id } });
  if (!isCategoryExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found!");
  }

  const productsCount = await prisma.medicine.count({ where: { categoryId: id } });
  
  if (productsCount > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can not delete the Category because it is related to products."
    );
  }

  const deletedCategory = await prisma.category.delete({ where: { id } });
  return deletedCategory;
};

export const CategoryService = {
  createCategory,
  getAllCategory,
  updateCategoryIntoDB,
  deleteCategoryIntoDB,
};
