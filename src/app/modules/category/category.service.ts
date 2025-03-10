import QueryBuilder from "../../builder/QueryBuilder";
import { IJwtPayload } from "../auth/auth.interface";
import { ICategory } from "./category.interface";
import { Category } from "./category.model";
import { USER_ROLE } from "../user/user.interface";

import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import Medicine from "../medicine/medicine.model";
import { IImageFile } from "../../interface/IImageFile";

const createCategory = async (
  categoryData: Partial<ICategory>,
  icon: IImageFile,
  authUser: IJwtPayload
) => {
  const category = new Category({
    ...categoryData,
    createdBy: authUser.userId,
    icon: icon?.path,
  });

  const result = await category.save();

  return result;
};

const getAllCategory = async (query: Record<string, unknown>) => {
  const categoryQuery = new QueryBuilder(
    Category.find().populate("parent").populate("type"),
    query
  )
    .search(["name", "slug"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const categories = await categoryQuery.modelQuery;
  const meta = await categoryQuery.countTotal();

  const categoryMap = new Map<string, any>();
  const hierarchy: any[] = [];

  categories.forEach((category: any) => {
    categoryMap.set(category._id.toString(), {
      ...category.toObject(),
      children: [],
    });
  });

  categories.forEach((category: any) => {
    const parentId = category.parent?._id?.toString();
    if (parentId && categoryMap.has(parentId)) {
      categoryMap
        .get(parentId)
        .children.push(categoryMap.get(category._id.toString()));
    } else if (!parentId) {
      hierarchy.push(categoryMap.get(category._id.toString()));
    }
  });

  return {
    meta,
    result: hierarchy,
  };
};

const updateCategoryIntoDB = async (
  id: string,
  payload: Partial<ICategory>,
  file: IImageFile,
  authUser: IJwtPayload
) => {
  const isCategoryExist = await Category.findById(id);
  if (!isCategoryExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found!");
  }

  if (
    authUser.role === USER_ROLE.customer &&
    isCategoryExist.createdBy.toString() !== authUser.userId
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are not able to edit the category!"
    );
  }

  if (file && file.path) {
    payload.icon = file.path;
  }

  const result = await Category.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

const deleteCategoryIntoDB = async (id: string, authUser: IJwtPayload) => {
  const isBrandExist = await Category.findById(id);
  if (!isBrandExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found!");
  }

  if (
    authUser.role === USER_ROLE.customer &&
    isBrandExist.createdBy.toString() !== authUser.userId
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are not able to delete the Category!"
    );
  }

  const product = await Medicine.findOne({ category: id });
  if (product)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can not delete the Category. Because the Category is related to products."
    );

  const deletedCategory = await Category.findByIdAndDelete(id);
  return deletedCategory;
};

export const CategoryService = {
  createCategory,
  getAllCategory,
  updateCategoryIntoDB,
  deleteCategoryIntoDB,
};
