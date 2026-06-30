import prisma from "../../utils/prisma";
import bcrypt from "bcrypt";
import config from "../../config";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createUserIntoDB = async (userData: any) => {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email }
  });

  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User with this email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    userData.password,
    Number(config.bcrypt_salt_rounds)
  );

  const result = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
      role: "CUSTOMER", // default
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
      createdAt: true,
      updatedAt: true,
    }
  });
  
  return result;
};

const createadminIntoDB = async (userData: any) => {
   const existingUser = await prisma.user.findUnique({
    where: { email: userData.email }
  });

  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(
    userData.password,
    Number(config.bcrypt_salt_rounds)
  );

  const result = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
      role: "ADMIN",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
      createdAt: true,
      updatedAt: true,
    }
  });

  return result;
};

const getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
      createdAt: true,
      updatedAt: true,
    }
  });
  return result;
};

const updateUserIntoDB = async (id: string, payload: any) => {
  const result = await prisma.user.update({
    where: { id },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
      createdAt: true,
      updatedAt: true,
    }
  });
  return result;
};

const deleteUserFromDB = async (id: string) => {
  const result = await prisma.user.delete({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    }
  });
  return result;
};

export const UserServices = {
  createUserIntoDB,
  createadminIntoDB,
  getAllUsersFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
};
