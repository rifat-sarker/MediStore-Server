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
  console.log('Seeding rich Bangladesh pharma demo data (60 products, 10 per department)...');

  const adminPassword = process.env.ADMIN_PASSWORD || '@Rifat1234';
  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  
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

  // 1. Categories
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

  // 2. 60 Authentic Products (10 per category)
  const allProducts = [
    // MEDICINES
    { name: 'Napa Extra Tablet', desc: 'Paracetamol & Caffeine for fast headache & fever relief.', price: 3.50, stock: 500, mfr: 'Beximco Pharmaceuticals Ltd.', rx: false, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80', cat: 'Medicines' },
    { name: 'Ace Plus Tablet', desc: 'Fast acting analgesic and antipyretic for moderate to intense fever and headaches.', price: 3.50, stock: 650, mfr: 'Square Pharmaceuticals PLC', rx: false, img: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80', cat: 'Medicines' },
    { name: 'Seclo 20 Capsule', desc: 'Omeprazole BP. Effective for peptic ulcer and acid reflux (GERD).', price: 7.00, stock: 450, mfr: 'Square Pharmaceuticals PLC', rx: false, img: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80', cat: 'Medicines' },
    { name: 'Pantonix 20 Tablet', desc: 'Pantoprazole Sodium. Relieves heartburn and heals gastric acid lesions.', price: 8.00, stock: 380, mfr: 'Incepta Pharmaceuticals Ltd.', rx: false, img: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80', cat: 'Medicines' },
    { name: 'Sergel 20 Capsule', desc: 'Esomeprazole Magnesium Trihydrate for rapid recovery from acid dyspepsia.', price: 8.00, stock: 290, mfr: 'Healthcare Pharmaceuticals Ltd.', rx: false, img: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&auto=format&fit=crop&q=80', cat: 'Medicines' },
    { name: 'Ciprocin 500 Tablet', desc: 'Broad-spectrum antibiotic for bacterial urinary & respiratory infections.', price: 18.00, stock: 200, mfr: 'Square Pharmaceuticals PLC', rx: true, img: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&auto=format&fit=crop&q=80', cat: 'Medicines' },
    { name: 'Monas 10 Tablet', desc: 'Montelukast Sodium for chronic asthma and allergic rhinitis relief.', price: 17.50, stock: 250, mfr: 'Acme Laboratories Ltd.', rx: false, img: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&auto=format&fit=crop&q=80', cat: 'Medicines' },
    { name: 'Tofen 1mg Tablet', desc: 'Ketotifen Fumarate anti-allergic antihistamine for respiratory comfort.', price: 3.00, stock: 310, mfr: 'Beximco Pharmaceuticals Ltd.', rx: false, img: 'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?w=600&auto=format&fit=crop&q=80', cat: 'Medicines' },
    { name: 'Alatrol 10mg Tablet', desc: 'Cetirizine Hydrochloride for 24h sneezing, itchy eyes and allergy relief.', price: 3.50, stock: 420, mfr: 'Square Pharmaceuticals PLC', rx: false, img: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=600&auto=format&fit=crop&q=80', cat: 'Medicines' },
    { name: 'Fexo 120mg Tablet', desc: 'Fexofenadine Hydrochloride non-drowsy allergy relief.', price: 9.00, stock: 280, mfr: 'Square Pharmaceuticals PLC', rx: false, img: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&auto=format&fit=crop&q=80', cat: 'Medicines' },

    // BABY & MOM
    { name: 'Pampers Baby Dry Diapers (Large 64 pcs)', desc: 'Up to 12 hours of overnight leak lock with aloe vera.', price: 1680.00, stock: 65, mfr: 'Procter & Gamble', rx: false, img: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', cat: 'Baby & Mom' },
    { name: 'Baby Cerelac Wheat & Apple (400g)', desc: 'Fortified Infant Cereal with Iron & Bifidus BL for 6+ months babies.', price: 495.00, stock: 110, mfr: 'Nestlé Bangladesh', rx: false, img: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&auto=format&fit=crop&q=80', cat: 'Baby & Mom' },
    { name: 'Sudocrem Antiseptic Healing Cream (125g)', desc: 'Barrier cream for diaper rash, eczema and cuts.', price: 750.00, stock: 80, mfr: 'Teva Pharmaceuticals', rx: false, img: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80', cat: 'Baby & Mom' },
    { name: 'Johnson\'s Baby Shampoo Tear-Free (200ml)', desc: 'Gentle tear-free formula tested by pediatricians.', price: 360.00, stock: 90, mfr: 'Johnson & Johnson', rx: false, img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&auto=format&fit=crop&q=80', cat: 'Baby & Mom' },
    { name: 'Aveeno Baby Daily Moisture Lotion (227ml)', desc: 'Natural Colloidal Oatmeal protects delicate baby skin for 24 hours.', price: 1150.00, stock: 50, mfr: 'Johnson & Johnson Consumer', rx: false, img: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80', cat: 'Baby & Mom' },
    { name: 'MamyPoko Pants Extra Clean (M 48 pcs)', desc: 'Breathable fit pants with soft elastic gathers to prevent rashes.', price: 1350.00, stock: 70, mfr: 'Unicharm Japan', rx: false, img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', cat: 'Baby & Mom' },
    { name: 'Mamaearth Stretch Marks Cream (100ml)', desc: 'Shea & Cocoa Butter formula reducing pregnancy stretch marks.', price: 680.00, stock: 45, mfr: 'Honasa Consumer', rx: false, img: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80', cat: 'Baby & Mom' },
    { name: 'Woodward\'s Gripe Water (130ml)', desc: 'Instant relief from griping pain, colic and teething discomfort.', price: 140.00, stock: 120, mfr: 'TTK Healthcare', rx: false, img: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=600&auto=format&fit=crop&q=80', cat: 'Baby & Mom' },
    { name: 'Philips Avent Natural Feeding Bottle (260ml)', desc: 'Anti-colic BPA-free breast-mimicking feeding bottle.', price: 1280.00, stock: 35, mfr: 'Philips Avent UK', rx: false, img: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&auto=format&fit=crop&q=80', cat: 'Baby & Mom' },
    { name: 'Sebamed Baby Wash Extra Soft (200ml)', desc: 'pH 5.5 balanced baby wash protecting skin acid mantle.', price: 890.00, stock: 40, mfr: 'Sebapharma Germany', rx: false, img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&auto=format&fit=crop&q=80', cat: 'Baby & Mom' },

    // DIABETIC CARE
    { name: 'Accu-Chek Instant Glucometer Kit', desc: 'Instant target range indicator blood glucose monitoring system.', price: 1850.00, stock: 45, mfr: 'Roche Diabetes Care', rx: false, img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80', cat: 'Diabetic Care' },
    { name: 'Accu-Chek Instant Test Strips (50 pcs)', desc: '50 glucose biosensor test strips with wide dosing area.', price: 1150.00, stock: 120, mfr: 'Roche Diagnostics Germany', rx: false, img: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80', cat: 'Diabetic Care' },
    { name: 'Glucerna SR Vanilla Powder (400g)', desc: 'Low GI slow release carbohydrate nutrition drink for diabetics.', price: 1250.00, stock: 50, mfr: 'Abbott Laboratories', rx: false, img: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=600&auto=format&fit=crop&q=80', cat: 'Diabetic Care' },
    { name: 'Sugar Free Gold Natura Sweetener (500 Pellets)', desc: 'Zero calorie heat-stable sucralose sweetener dispenser.', price: 360.00, stock: 140, mfr: 'Zydus Wellness', rx: false, img: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80', cat: 'Diabetic Care' },
    { name: 'BD Ultra-Fine Insulin Pen Needles 4mm (100 pcs)', desc: '32G micro-fine pen needles with EasyFlow technology.', price: 1850.00, stock: 60, mfr: 'Becton Dickinson USA', rx: false, img: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=600&auto=format&fit=crop&q=80', cat: 'Diabetic Care' },
    { name: 'Contour Plus Blood Glucose Meter', desc: 'Second-chance sampling meter saving strip waste.', price: 1650.00, stock: 40, mfr: 'Ascensia Diabetes Care', rx: false, img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80', cat: 'Diabetic Care' },
    { name: 'On-Call Plus Test Strips (50 pcs)', desc: 'Accurate electrochemical blood glucose strips with 10s reading.', price: 780.00, stock: 130, mfr: 'ACON Laboratories USA', rx: false, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80', cat: 'Diabetic Care' },
    { name: 'Diabetic Seamless Cotton Socks (Pair)', desc: 'Non-binding circulation socks protecting sensitive feet.', price: 320.00, stock: 85, mfr: 'MediCare Ortho', rx: false, img: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=600&auto=format&fit=crop&q=80', cat: 'Diabetic Care' },
    { name: 'Lantus Solostar Insulin Pen (100 IU/ml)', desc: 'Once-daily 24-hour basal analog for glycemic control.', price: 880.00, stock: 55, mfr: 'Sanofi Bangladesh', rx: true, img: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80', cat: 'Diabetic Care' },
    { name: 'Accu-Chek Softclix Lancets (100 pcs)', desc: 'Sterile 28G gentle clix lancets for virtually pain-free sampling.', price: 490.00, stock: 160, mfr: 'Roche Diagnostics', rx: false, img: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80', cat: 'Diabetic Care' },

    // HEALTH & DEVICES
    { name: 'Omron HEM-7120 Digital BP Monitor', desc: 'Clinically validated automatic upper-arm blood pressure monitor.', price: 2650.00, stock: 35, mfr: 'Omron Healthcare Japan', rx: false, img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80', cat: 'Health & Devices' },
    { name: 'Littmann Classic III Stethoscope', desc: 'Acoustic diagnostic stethoscope with tunable diaphragm.', price: 8900.00, stock: 20, mfr: '3M Littmann USA', rx: false, img: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600&auto=format&fit=crop&q=80', cat: 'Health & Devices' },
    { name: 'Savlon Antiseptic Liquid (1000ml)', desc: 'Hospital-strength antiseptic disinfectant for cuts & hygiene.', price: 280.00, stock: 300, mfr: 'ACI Limited', rx: false, img: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80', cat: 'Health & Devices' },
    { name: 'Rossmax Compressor Nebulizer (NA100)', desc: 'Fine aerosol medication delivery for asthma and bronchitis.', price: 3450.00, stock: 30, mfr: 'Rossmax Switzerland', rx: false, img: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=600&auto=format&fit=crop&q=80', cat: 'Health & Devices' },
    { name: 'Beurer FT09 Digital Clinical Thermometer', desc: 'Mercury-free waterproof fever measurement with acoustic signal.', price: 380.00, stock: 90, mfr: 'Beurer Germany', rx: false, img: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=600&auto=format&fit=crop&q=80', cat: 'Health & Devices' },
    { name: 'Fingertip Pulse Oximeter OLED (SpO2)', desc: 'Instant check of blood oxygen percentage and pulse rate in 5 seconds.', price: 1150.00, stock: 75, mfr: 'ChoiceMMed', rx: false, img: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=600&auto=format&fit=crop&q=80', cat: 'Health & Devices' },
    { name: 'Flamingo Orthopedic Lumbar Sacro Belt', desc: 'Therapeutic compression and spinal support for back pain.', price: 1250.00, stock: 45, mfr: 'Flamingo Ortho', rx: false, img: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80', cat: 'Health & Devices' },
    { name: 'Sterile Surgical Latex Gloves (100 pcs)', desc: 'Micro-textured medical examination gloves.', price: 650.00, stock: 140, mfr: 'Top Glove', rx: false, img: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=600&auto=format&fit=crop&q=80', cat: 'Health & Devices' },
    { name: 'Hansaplast Universal Adhesive Bandages (100 pcs)', desc: 'Water repellent first aid plasters with non-stick wound pad.', price: 250.00, stock: 220, mfr: 'Beiersdorf', rx: false, img: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=600&auto=format&fit=crop&q=80', cat: 'Health & Devices' },
    { name: 'Hot & Cold Reusable Gel Compress Pack', desc: 'Drug-free hot and cold compress therapy pack for sprains and aches.', price: 450.00, stock: 80, mfr: 'Nexcare / 3M', rx: false, img: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=600&auto=format&fit=crop&q=80', cat: 'Health & Devices' },

    // PERSONAL CARE
    { name: 'CeraVe Daily Moisturizing Lotion (236ml)', desc: 'Formulated with 3 essential ceramides and hyaluronic acid.', price: 1450.00, stock: 80, mfr: 'CeraVe / L\'Oréal', rx: false, img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&auto=format&fit=crop&q=80', cat: 'Personal Care' },
    { name: 'Cetaphil Gentle Skin Cleanser (250ml)', desc: 'Hydrating non-foaming facial cleanser for sensitive skin.', price: 1350.00, stock: 65, mfr: 'Galderma', rx: false, img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80', cat: 'Personal Care' },
    { name: 'Bioderma Sensibio H2O Micellar Water (500ml)', desc: 'Soothing make-up removing micellar solution for sensitive face.', price: 1950.00, stock: 40, mfr: 'NAOS Bioderma France', rx: false, img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&auto=format&fit=crop&q=80', cat: 'Personal Care' },
    { name: 'Sensodyne Rapid Relief Toothpaste (100g)', desc: 'Clinically proven to beat tooth sensitivity in 60 seconds.', price: 290.00, stock: 140, mfr: 'GSK Consumer Healthcare', rx: false, img: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80', cat: 'Personal Care' },
    { name: 'Neutrogena Hydro Boost Water Gel (50g)', desc: 'Hyaluronic acid gel moisturizer quenching dry facial skin.', price: 1190.00, stock: 55, mfr: 'Johnson & Johnson', rx: false, img: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80', cat: 'Personal Care' },
    { name: 'Selsun Blue Anti-Dandruff Shampoo (120ml)', desc: 'Selenium Sulfide 1% shampoo controlling tough dandruff flakes.', price: 650.00, stock: 70, mfr: 'Sanofi Consumer', rx: false, img: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80', cat: 'Personal Care' },
    { name: 'Dettol Original Anti-Bacterial Hand Wash (250ml)', desc: 'Kills 99.9% of germs for hygienically clean hands.', price: 155.00, stock: 200, mfr: 'Reckitt Benckiser', rx: false, img: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=600&auto=format&fit=crop&q=80', cat: 'Personal Care' },
    { name: 'Listerine Cool Mint Mouthwash (250ml)', desc: 'Antibacterial mouthwash removing up to 99% of oral bacteria.', price: 280.00, stock: 110, mfr: 'Johnson & Johnson', rx: false, img: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=600&auto=format&fit=crop&q=80', cat: 'Personal Care' },
    { name: 'Whisper Ultra Clean Sanitary Pads (XL 30 pcs)', desc: 'Extra long lock-core absorbent menstrual sanitary pads.', price: 360.00, stock: 130, mfr: 'Procter & Gamble', rx: false, img: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=600&auto=format&fit=crop&q=80', cat: 'Personal Care' },
    { name: 'Nivea Men Deep Impact Roll-on Deodorant (50ml)', desc: '48h black carbon formula protecting against sweat and odor.', price: 320.00, stock: 85, mfr: 'Beiersdorf', rx: false, img: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80', cat: 'Personal Care' },

    // VITAL WELLNESS
    { name: 'Bextram Gold Multivitamin', desc: '32 essential vitamins and minerals for daily energy and stamina.', price: 15.00, stock: 220, mfr: 'Beximco Pharmaceuticals Ltd.', rx: false, img: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&auto=format&fit=crop&q=80', cat: 'Vital Wellness' },
    { name: 'D-Rise 20,000 IU Capsule', desc: 'High potency Vitamin D3 for bone density and immune strength.', price: 45.00, stock: 140, mfr: 'Square Pharmaceuticals PLC', rx: false, img: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&auto=format&fit=crop&q=80', cat: 'Vital Wellness' },
    { name: 'Organic Green Tea & Detox Infusion', desc: 'Antioxidant rich Camellia Sinensis tea supporting metabolism and cleansing.', price: 320.00, stock: 95, mfr: 'Kazi & Kazi Tea', rx: false, img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&auto=format&fit=crop&q=80', cat: 'Vital Wellness' },
    { name: 'Optimum Nutrition Gold Standard 100% Whey (2 lbs)', desc: '24g protein and 5.5g BCAAs per scoop for muscle repair and recovery.', price: 4850.00, stock: 35, mfr: 'Optimum Nutrition USA', rx: false, img: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&auto=format&fit=crop&q=80', cat: 'Vital Wellness' },
    { name: 'Omega-3 Fish Oil 1000mg Softgels (60 pcs)', desc: 'EPA and DHA purified fish oil for heart, brain and joints.', price: 1850.00, stock: 75, mfr: 'Nature\'s Bounty USA', rx: false, img: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80', cat: 'Vital Wellness' },
    { name: 'Ceevit 250mg Chewable Tablet (Vitamin C)', desc: 'Orange chewable Vitamin C for immune defense and tissue healing.', price: 2.50, stock: 600, mfr: 'Square Pharmaceuticals PLC', rx: false, img: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80', cat: 'Vital Wellness' },
    { name: 'CoralCal-D Tablet (Coral Calcium + D3)', desc: '73 trace minerals from coral marine calcium combating bone porosity.', price: 14.00, stock: 180, mfr: 'Radiant Pharmaceuticals', rx: false, img: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80', cat: 'Vital Wellness' },
    { name: 'Zinc-B Tablet (Zinc + Vitamin B-Complex)', desc: 'Therapeutic zinc and B-vitamins speeding up wound healing and vitality.', price: 3.50, stock: 350, mfr: 'Incepta Pharmaceuticals Ltd.', rx: false, img: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&auto=format&fit=crop&q=80', cat: 'Vital Wellness' },
    { name: 'Himalaya Ashwagandha Capsules (60 pcs)', desc: 'Pure withania somnifera adaptogen regulating stress and restoring stamina.', price: 850.00, stock: 90, mfr: 'The Himalaya Drug Company', rx: false, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80', cat: 'Vital Wellness' },
    { name: 'Nature Made Melatonin 5mg Sleep Aid (90 Tablets)', desc: 'Drug-free sleep aid regulating natural circadian rest and wake cycles.', price: 1450.00, stock: 65, mfr: 'Nature Made USA', rx: false, img: 'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?w=600&auto=format&fit=crop&q=80', cat: 'Vital Wellness' },
  ];

  for (const item of allProducts) {
    const cat = catMap[item.cat] || catMap['Medicines'];
    const existing = await prisma.medicine.findFirst({ where: { name: item.name } });
    if (!existing) {
      await prisma.medicine.create({
        data: {
          name: item.name,
          description: item.desc,
          price: item.price,
          stock: item.stock,
          manufacturer: item.mfr,
          requiredPrescription: item.rx,
          imageUrl: item.img,
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
          imageUrl: item.img,
          categoryId: cat.id,
          manufacturer: item.mfr,
          description: item.desc,
        },
      });
    }
  }

  // 3. Coupon
  await prisma.coupon.upsert({
    where: { code: 'EPHARMA10' },
    update: {},
    create: { code: 'EPHARMA10', discountPct: 10, expiryDate: new Date('2028-12-31'), isActive: true },
  });

  console.log('✅ Successfully seeded full 60 products catalog with verified images across all 6 departments!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
