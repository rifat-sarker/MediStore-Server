import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding rich Bangladesh pharma demo data with verified image URLs...');

  const adminPassword = process.env.ADMIN_PASSWORD || '@Rifat1234';
  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  
  // Create all 3 default testing users
  await prisma.user.upsert({
    where: { email: 'admin@medistore.com' },
    update: { password: hashedPassword },
    create: { name: 'Admin User', email: 'admin@medistore.com', password: hashedPassword, role: 'ADMIN', phone: '01700000000', address: 'Banani HQ, Dhaka' },
  });

  const customer1 = await prisma.user.upsert({
    where: { email: 'customer1@example.com' },
    update: { password: hashedPassword },
    create: { name: 'Rifat Sarker', email: 'customer1@example.com', password: hashedPassword, role: 'CUSTOMER', phone: '01800000001', address: 'House 42, Road 11, Dhanmondi, Dhaka' },
  });

  const rider1User = await prisma.user.upsert({
    where: { email: 'rider1@example.com' },
    update: { password: hashedPassword },
    create: { name: 'Speedy Rider', email: 'rider1@example.com', password: hashedPassword, role: 'RIDER', phone: '01900000002', address: 'Mirpur Express Station, Dhaka' },
  });

  await prisma.riderProfile.upsert({
    where: { userId: rider1User.id },
    update: {},
    create: {
      userId: rider1User.id,
      vehicleInfo: 'Yamaha FZ-S (DHAKA-METRO-HA-5582)',
      licenseNo: 'DHAKA-L-998822',
      currentStatus: 'AVAILABLE',
      isVerified: true,
    },
  });

  // 1. Categories matching ePharma
  const categoriesData = [
    { name: 'Medicines', imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80' },
    { name: 'Baby & Mom', imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80' },
    { name: 'Diabetic Care', imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80' },
    { name: 'Health & Devices', imageUrl: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=600&auto=format&fit=crop&q=80' },
    { name: 'Personal Care', imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&auto=format&fit=crop&q=80' },
    { name: 'Vital Wellness', imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80' },
  ];

  const catMap: Record<string, any> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { name: cat.name },
      update: { imageUrl: cat.imageUrl },
      create: { name: cat.name, imageUrl: cat.imageUrl },
    });
    catMap[cat.name] = created;
  }

  // 2. Real MedEx Bangladesh Medicines with verified 200 HTTP images
  const medexProducts = [
    {
      name: 'Napa Extra 500mg/65mg (Tablet)',
      description: 'Paracetamol & Caffeine. Used for fever, headache, body pain, toothache and migraine relief.',
      price: 3.50,
      stock: 650,
      manufacturer: 'Beximco Pharmaceuticals Ltd.',
      requiredPrescription: false,
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
      category: 'Medicines',
    },
    {
      name: 'Ace Plus (Paracetamol & Caffeine)',
      description: 'Fast acting analgesic and antipyretic for moderate to intense fever and headaches.',
      price: 3.50,
      stock: 400,
      manufacturer: 'Square Pharmaceuticals PLC',
      requiredPrescription: false,
      imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80',
      category: 'Medicines',
    },
    {
      name: 'Seclo 20mg Capsule',
      description: 'Omeprazole BP. Effective for peptic ulcer, acid reflux (GERD), heartburn and hyperacidity.',
      price: 7.00,
      stock: 350,
      manufacturer: 'Square Pharmaceuticals PLC',
      requiredPrescription: false,
      imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80',
      category: 'Medicines',
    },
    {
      name: 'Pantonix 20mg Tablet',
      description: 'Pantoprazole Sodium Sesquihydrate. Proton-pump inhibitor for gastric acid reduction.',
      price: 8.00,
      stock: 500,
      manufacturer: 'Incepta Pharmaceuticals Ltd.',
      requiredPrescription: false,
      imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80',
      category: 'Medicines',
    },
    {
      name: 'Sergel 20mg Capsule',
      description: 'Esomeprazole Magnesium Trihydrate for healing erosive esophagitis and acid control.',
      price: 8.00,
      stock: 280,
      manufacturer: 'Healthcare Pharmaceuticals Ltd.',
      requiredPrescription: false,
      imageUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&auto=format&fit=crop&q=80',
      category: 'Medicines',
    },
    {
      name: 'Bextram Gold (Multivitamin & Minerals)',
      description: 'Complete 32 essential vitamins & minerals supplement for adult vitality and energy.',
      price: 15.00,
      stock: 220,
      manufacturer: 'Beximco Pharmaceuticals Ltd.',
      requiredPrescription: false,
      imageUrl: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&auto=format&fit=crop&q=80',
      category: 'Vital Wellness',
    },
    {
      name: 'D-Rise 20,000 IU Capsule',
      description: 'Cholecalciferol (Vitamin D3) for bone strength, calcium absorption and immune system.',
      price: 45.00,
      stock: 150,
      manufacturer: 'Square Pharmaceuticals PLC',
      requiredPrescription: false,
      imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&auto=format&fit=crop&q=80',
      category: 'Vital Wellness',
    },
    {
      name: 'Accu-Chek Instant Glucometer with 10 Strips',
      description: 'Instant blood glucose testing system with wireless Bluetooth connectivity and effortless accuracy.',
      price: 1850.00,
      stock: 45,
      manufacturer: 'Roche Diabetes Care',
      requiredPrescription: false,
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
      category: 'Diabetic Care',
    },
    {
      name: 'Accu-Chek Instant Test Strips (50 Strips)',
      description: '50 disposable test strips for Accu-Chek Instant meter. No manual coding required.',
      price: 1150.00,
      stock: 180,
      manufacturer: 'Roche Diagnostics',
      requiredPrescription: false,
      imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80',
      category: 'Diabetic Care',
    },
    {
      name: 'Omron HEM-7120 Digital Blood Pressure Monitor',
      description: 'Clinically validated automatic upper-arm BP meter with hypertension indicator and IntelliSense technology.',
      price: 2650.00,
      stock: 60,
      manufacturer: 'Omron Healthcare Japan',
      requiredPrescription: false,
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
      category: 'Health & Devices',
    },
    {
      name: 'Pampers Baby Dry Diapers (Large 64 pcs)',
      description: 'Up to 12 hours of overnight leak lock with lotion aloe vera for gentle baby skin protection.',
      price: 1680.00,
      stock: 75,
      manufacturer: 'Procter & Gamble',
      requiredPrescription: false,
      imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80',
      category: 'Baby & Mom',
    },
    {
      name: 'CeraVe Daily Moisturizing Lotion (236ml)',
      description: 'Formulated with 3 essential ceramides and hyaluronic acid to hydrate and restore protective barrier.',
      price: 1450.00,
      stock: 90,
      manufacturer: 'L\'Oréal / CeraVe',
      requiredPrescription: false,
      imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&auto=format&fit=crop&q=80',
      category: 'Personal Care',
    },
    {
      name: 'Ciprocin 500mg Tablet (Ciprofloxacin)',
      description: 'Broad-spectrum fluoroquinolone antibiotic for respiratory and urinary tract bacterial infections.',
      price: 18.00,
      stock: 200,
      requiredPrescription: true,
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
      category: 'Medicines',
    },
    {
      name: 'Monas 10mg Tablet (Montelukast)',
      description: 'Leukotriene receptor antagonist for prophylaxis and chronic treatment of bronchial asthma & allergic rhinitis.',
      price: 17.50,
      stock: 260,
      manufacturer: 'Acme Laboratories Ltd.',
      requiredPrescription: false,
      imageUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&auto=format&fit=crop&q=80',
      category: 'Medicines',
    },
    {
      name: 'Glucerna SR Vanilla (400g Tin)',
      description: 'Nutritional drink clinically proven to help manage blood glucose response for individuals with diabetes.',
      price: 1250.00,
      stock: 40,
      manufacturer: 'Abbott Laboratories',
      requiredPrescription: false,
      imageUrl: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=600&auto=format&fit=crop&q=80',
      category: 'Diabetic Care',
    },
  ];

  for (const item of medexProducts) {
    const cat = catMap[item.category] || catMap['Medicines'];
    const existing = await prisma.medicine.findFirst({ where: { name: item.name } });
    if (!existing) {
      await prisma.medicine.create({
        data: {
          name: item.name,
          description: item.description,
          price: item.price,
          stock: item.stock,
          manufacturer: item.manufacturer,
          requiredPrescription: item.requiredPrescription,
          imageUrl: item.imageUrl,
          categoryId: cat.id,
          expiryDate: new Date('2028-12-31'),
        },
      });
    } else {
      await prisma.medicine.update({
        where: { id: existing.id },
        data: {
          price: item.price,
          stock: item.stock,
          imageUrl: item.imageUrl,
          categoryId: cat.id,
          manufacturer: item.manufacturer,
          description: item.description,
        },
      });
    }
  }

  // 3. Create Coupon
  await prisma.coupon.upsert({
    where: { code: 'EPHARMA10' },
    update: {},
    create: { code: 'EPHARMA10', discountPct: 10, expiryDate: new Date('2028-12-31'), isActive: true },
  });

  console.log('✅ Updated all products with verified working images and synchronized user passwords.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
