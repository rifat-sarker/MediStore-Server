import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createCategory = async (categoryData: { name: string; imageUrl?: string }) => {
  const result = await prisma.category.create({
    data: {
      name: categoryData.name,
      imageUrl: categoryData.imageUrl || null,
    },
  });
  return result;
};

const getAllCategory = async (query: Record<string, unknown>) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  return {
    meta: { total: categories.length },
    result: categories,
  };
};

const updateCategoryIntoDB = async (id: string, payload: any) => {
  const isCategoryExist = await prisma.category.findUnique({ where: { id } });
  if (!isCategoryExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found!");
  }
  const result = await prisma.category.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteCategoryIntoDB = async (id: string) => {
  const isCategoryExist = await prisma.category.findUnique({ where: { id } });
  if (!isCategoryExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found!");
  }
  const productsCount = await prisma.medicine.count({ where: { categoryId: id } });
  if (productsCount > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot delete category — it has medicines linked to it."
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
