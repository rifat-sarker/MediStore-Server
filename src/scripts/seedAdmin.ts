import prisma from "../app/utils/prisma";
import bcrypt from "bcrypt";
import config from "../app/config";

/**
 * Seeds a default ADMIN account on server startup.
 * Only runs if no ADMIN user exists in the database.
 *
 * Credentials are pulled from environment variables:
 *   ADMIN_NAME     (default: "Super Admin")
 *   ADMIN_EMAIL    (default: "admin@medistore.com")
 *   ADMIN_PASSWORD (default: "Admin@12345")
 */
export const seedAdmin = async () => {
  try {
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (existingAdmin) {
      console.log("✅ Admin already exists — skipping seed");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      config.admin_password,
      Number(config.bcrypt_salt_rounds)
    );

    const admin = await prisma.user.create({
      data: {
        name: config.admin_name,
        email: config.admin_email,
        password: hashedPassword,
        role: "ADMIN",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    console.log("🌱 Default admin seeded successfully:");
    console.log(`   Name  : ${admin.name}`);
    console.log(`   Email : ${admin.email}`);
    console.log(`   Role  : ${admin.role}`);
    console.log(
      `   ⚠️  Change the default password immediately after first login!`
    );
  } catch (error) {
    console.error("❌ Admin seed failed:", error);
  }
};
