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

const getAllCategory = async (query: Record<string, unknown> = {}) => {
  const { page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      skip,
      take,
      orderBy: { name: "asc" },
    }),
    prisma.category.count()
  ]);

  return {
    meta: { 
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage: Math.ceil(total / Number(limit))
    },
    result: categories,
  };
};

const updateCategoryIntoDB = async (id: string, payload: any) => {
  const isCategoryExist = await prisma.category.findUnique({ where: { id } });
  if (!isCategoryExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found!");
  }

  // Map `title` → `name` if frontend sends `title`
  const updateData: { name?: string; imageUrl?: string } = {};
  if (payload.name !== undefined) updateData.name = payload.name;
  if (payload.title !== undefined) updateData.name = payload.title;
  if (payload.imageUrl !== undefined) updateData.imageUrl = payload.imageUrl;

  // Check if another category already has this name (unique constraint)
  if (updateData.name) {
    const duplicate = await prisma.category.findFirst({
      where: {
        name: { equals: updateData.name, mode: "insensitive" },
        id: { not: id },
      },
    });
    if (duplicate) {
      throw new AppError(
        httpStatus.CONFLICT,
        `Category with name "${updateData.name}" already exists!`
      );
    }
  }

  const result = await prisma.category.update({
    where: { id },
    data: updateData,
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
