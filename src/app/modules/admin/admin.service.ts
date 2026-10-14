import prisma from "../../utils/prisma";

const getDashboardStats = async () => {
  const [
    totalUsers,
    totalMedicines,
    totalOrders,
    totalRevenueResult,
    pendingOrders,
    deliveredOrders,
    recentOrders,
    lowStockMedicines,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.medicine.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { totalAmount: true },
    }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { medicine: { select: { name: true } } } },
      },
    }),
    prisma.medicine.findMany({
      where: { stock: { lt: 10 } },
      take: 5,
      select: { id: true, name: true, stock: true, price: true },
    }),
  ]);

  return {
    totalUsers,
    totalMedicines,
    totalOrders,
    totalRevenue: totalRevenueResult._sum.totalAmount || 0,
    pendingOrders,
    deliveredOrders,
    recentOrders,
    lowStockMedicines,
  };
};

export const AdminService = {
  getDashboardStats,
};
