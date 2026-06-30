import prisma from "../../utils/prisma";
import redisClient from "../../utils/redis";

const CACHE_KEY = "medicines:all";
const CACHE_TTL = 60 * 5; // 5 minutes

const createMedicineIntoDB = async (medicineData: any) => {
  const result = await prisma.medicine.create({
    data: {
      ...medicineData,
      expiryDate: new Date(medicineData.expiryDate),
    },
  });
  // Invalidate cache
  try {
    await redisClient.del(CACHE_KEY);
  } catch {}
  return result;
};


const getAllMedicineFromDB = async (query: Record<string, unknown>) => {
  const {
    minPrice,
    maxPrice,
    categories,
    inStock,
    searchTerm,
    page = 1,
    limit = 10,
  } = query;

  const hasFilters = minPrice || maxPrice || categories || inStock || searchTerm || Number(page) !== 1;

  // Try cache only for default listing (no filters, page 1)
  if (!hasFilters) {
    try {
      const cached = await redisClient.get(CACHE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {}
  }

  const filter: any = {};

  if (categories) {
    const categoryArray =
      typeof categories === "string"
        ? categories.split(",")
        : Array.isArray(categories)
        ? categories
        : [categories];
    filter.categoryId = { in: categoryArray };
  }

  if (inStock !== undefined) {
    filter.stock = inStock === "true" ? { gt: 0 } : 0;
  }

  if (searchTerm) {
    filter.OR = [
      { name: { contains: searchTerm as string, mode: "insensitive" } },
      { description: { contains: searchTerm as string, mode: "insensitive" } },
      { manufacturer: { contains: searchTerm as string, mode: "insensitive" } },
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.lte = Number(maxPrice);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const [products, total] = await Promise.all([
    prisma.medicine.findMany({
      where: filter,
      skip,
      take,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.medicine.count({ where: filter }),
  ]);

  const data = {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage: Math.ceil(total / Number(limit)),
    },
    result: products,
  };

  // Cache only unfiltered results
  if (!hasFilters) {
    try {
      await redisClient.setEx(CACHE_KEY, CACHE_TTL, JSON.stringify(data));
    } catch {}
  }

  return data;
};

const getASpecificMedicineFromDB = async (id: string) => {
  const result = await prisma.medicine.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
  return result;
};

const updateMedicineIntoDB = async (id: string, payload: any) => {
  const data: any = { ...payload };
  if (payload.expiryDate) {
    data.expiryDate = new Date(payload.expiryDate);
  }
  const result = await prisma.medicine.update({
    where: { id },
    data,
  });
  // Invalidate cache
  try {
    await redisClient.del(CACHE_KEY);
  } catch {}
  return result;
};


const deleteMedicineFromDB = async (id: string) => {
  const result = await prisma.medicine.delete({ where: { id } });
  try {
    await redisClient.del(CACHE_KEY);
  } catch {}
  return result;
};

export const MedicineServices = {
  createMedicineIntoDB,
  getAllMedicineFromDB,
  getASpecificMedicineFromDB,
  updateMedicineIntoDB,
  deleteMedicineFromDB,
};
