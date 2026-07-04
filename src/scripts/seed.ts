import { Role, OrderStatus, PaymentStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import config from '../app/config';
import prisma from '../app/utils/prisma';

async function main() {
  console.log('Seeding database with 50+ static items...');

  // Hash password for users
  const hashedPassword = await bcrypt.hash('password123', Number(config.bcrypt_salt_rounds) || 10);

  // 1. Categories
  const categories = [];
  console.log('Creating Categories...');
  for (let i = 0; i < 20; i++) {
    const name = faker.commerce.department() + ' ' + faker.string.uuid().slice(0, 4);
    const category = await prisma.category.create({
      data: {
        name,
        imageUrl: faker.image.urlLoremFlickr({ category: 'medical' }),
      },
    });
    categories.push(category);
  }

  // 2. Medicines (50 items)
  const medicines = [];
  console.log('Creating Medicines...');
  for (let i = 0; i < 50; i++) {
    const category = faker.helpers.arrayElement(categories);
    const medicine = await prisma.medicine.create({
      data: {
        name: faker.commerce.productName() + ' Pills',
        description: faker.lorem.paragraph(),
        price: parseFloat(faker.commerce.price({ min: 10, max: 2000 })),
        stock: faker.number.int({ min: 10, max: 500 }),
        requiredPrescription: faker.datatype.boolean(),
        manufacturer: faker.company.name() + ' Pharma',
        imageUrl: faker.image.urlLoremFlickr({ category: 'medicine' }),
        categoryId: category.id,
        expiryDate: faker.date.future({ years: 2 }),
      },
    });
    medicines.push(medicine);
  }

  // 3. Users & Riders
  console.log('Creating Users & Riders...');
  const customers = [];
  const riders = [];
  for (let i = 0; i < 50; i++) {
    const role = faker.helpers.arrayElement(['CUSTOMER', 'RIDER']) as Role;
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email() + faker.string.uuid().slice(0,4),
        password: hashedPassword,
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        role: role,
      },
    });
    if (role === 'CUSTOMER') {
      customers.push(user);
    } else {
      const rider = await prisma.riderProfile.create({
        data: {
          userId: user.id,
          vehicleInfo: faker.vehicle.vehicle(),
          licenseNo: faker.string.alphanumeric(10).toUpperCase(),
          currentStatus: faker.helpers.arrayElement(['AVAILABLE', 'BUSY', 'OFFLINE']),
          isVerified: faker.datatype.boolean(),
        },
      });
      riders.push({ ...rider, user });
    }
  }

  // 4. Orders
  console.log('Creating Orders...');
  for (let i = 0; i < 50; i++) {
    const customer = faker.helpers.arrayElement(customers);
    if (!customer) continue;

    const numItems = faker.number.int({ min: 1, max: 5 });
    const orderItems = [];
    let totalAmount = 0;

    for (let j = 0; j < numItems; j++) {
      const medicine = faker.helpers.arrayElement(medicines);
      const quantity = faker.number.int({ min: 1, max: 5 });
      const price = medicine.price;
      totalAmount += price * quantity;
      orderItems.push({
        medicineId: medicine.id,
        quantity,
        price,
      });
    }

    const hasRider = faker.datatype.boolean();
    const rider = hasRider ? faker.helpers.arrayElement(riders) : null;

    const orderStatusEnum = hasRider
      ? faker.helpers.arrayElement(['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'])
      : faker.helpers.arrayElement(['PENDING', 'VERIFYING', 'PROCESSING']);

    await prisma.order.create({
      data: {
        userId: customer.id,
        riderId: rider?.id,
        status: orderStatusEnum as OrderStatus,
        totalAmount,
        paymentStatus: faker.helpers.arrayElement(['PENDING', 'PAID', 'FAILED']) as PaymentStatus,
        paymentMethod: 'CASH_ON_DELIVERY',
        transactionId: faker.string.uuid(),
        shippingAddress: faker.location.streetAddress(),
        items: {
          create: orderItems,
        },
      },
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
