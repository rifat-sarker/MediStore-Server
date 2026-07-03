import prisma from '../src/app/utils/prisma';
import * as bcrypt from 'bcrypt';

async function main() {
  console.log('Seeding all demo data...');

  // 1. Create Users (Admin, Customers, Riders)
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@medistore.com' },
    update: {},
    create: { name: 'Admin User', email: 'admin@medistore.com', password: hashedPassword, role: 'ADMIN', phone: '01700000000', address: 'Admin HQ' },
  });

  const customer1 = await prisma.user.upsert({
    where: { email: 'customer1@example.com' },
    update: {},
    create: { name: 'John Doe', email: 'customer1@example.com', password: hashedPassword, role: 'CUSTOMER', phone: '01800000001', address: '123 Main St, Dhaka' },
  });

  const rider1User = await prisma.user.upsert({
    where: { email: 'rider1@example.com' },
    update: {},
    create: { name: 'Speedy Rider', email: 'rider1@example.com', password: hashedPassword, role: 'RIDER', phone: '01900000002', address: 'Rider Base' },
  });

  // 2. Create Rider Profile
  const riderProfile = await prisma.riderProfile.upsert({
    where: { userId: rider1User.id },
    update: {},
    create: {
      userId: rider1User.id,
      vehicleInfo: 'Honda CB Hornet 160R',
      licenseNo: 'DHAKA-L-123456',
      currentStatus: 'AVAILABLE',
      isVerified: true,
    },
  });

  // 3. Create Categories
  const painRelief = await prisma.category.upsert({
    where: { name: 'Pain Relief' },
    update: {},
    create: { name: 'Pain Relief', imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5e4b7b34b?q=80&w=600&auto=format&fit=crop' },
  });

  const vitamins = await prisma.category.upsert({
    where: { name: 'Vitamins & Supplements' },
    update: {},
    create: { name: 'Vitamins & Supplements', imageUrl: 'https://images.unsplash.com/photo-1550572017-edb9894e7724?q=80&w=600&auto=format&fit=crop' },
  });

  // 4. Create Medicines
  const paracetamol = await prisma.medicine.upsert({
    where: { id: 'demo-med-1' }, // Dummy check
    update: {},
    create: {
      name: 'Paracetamol 500mg', description: 'Effective pain relief.', price: 2.5, stock: 500, manufacturer: 'Square', expiryDate: new Date('2026-12-31'),
      imageUrl: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=600&auto=format&fit=crop', categoryId: painRelief.id
    },
  }).catch(() => prisma.medicine.findFirst({ where: { name: 'Paracetamol 500mg' } }));

  const vitaminC = await prisma.medicine.upsert({
    where: { id: 'demo-med-2' },
    update: {},
    create: {
      name: 'Vitamin C 1000mg', description: 'Boosts immune system.', price: 8.5, stock: 200, manufacturer: 'Incepta', expiryDate: new Date('2028-01-15'),
      imageUrl: 'https://images.unsplash.com/photo-1550572017-edb9894e7724?q=80&w=600&auto=format&fit=crop', categoryId: vitamins.id
    },
  }).catch(() => prisma.medicine.findFirst({ where: { name: 'Vitamin C 1000mg' } }));

  // 5. Create Coupons
  const coupon = await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: { code: 'WELCOME10', discountPct: 10, expiryDate: new Date('2025-12-31'), isActive: true },
  });

  // 6. Create Orders and OrderItems
  if (paracetamol && vitaminC) {
    const order = await prisma.order.create({
      data: {
        userId: customer1.id,
        riderId: riderProfile.id,
        totalAmount: 13.5,
        status: 'DELIVERED',
        paymentStatus: 'PAID',
        paymentMethod: 'SSLCOMMERZ',
        shippingAddress: customer1.address!,
        items: {
          create: [
            { medicineId: paracetamol.id, quantity: 2, price: 2.5 },
            { medicineId: vitaminC.id, quantity: 1, price: 8.5 },
          ]
        }
      }
    });

    // 7. Create Reviews
    await prisma.review.create({
      data: {
        userId: customer1.id,
        medicineId: paracetamol.id,
        rating: 5,
        comment: 'Very effective and fast delivery.',
      }
    });

    // 8. Create Subscriptions
    await prisma.subscription.create({
      data: {
        userId: customer1.id,
        medicineId: vitaminC.id,
        quantity: 1,
        intervalDays: 30,
        nextDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
      }
    });
  }

  console.log('All models seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
