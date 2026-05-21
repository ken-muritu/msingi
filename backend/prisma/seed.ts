import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🎵 Seeding Kora database (Jenga Electronics template)...\n');

  // Load electronics template
  const categoriesPath = path.join(__dirname, '../../templates/electronics/categories.json');
  const templateCategories = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));

  // ─── Admin User ─────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@jenga.co.ke' },
    update: {},
    create: {
      email: 'admin@jenga.co.ke',
      phone: '+254700000001',
      name: 'Kora Admin',
      passwordHash: adminPassword,
      role: 'super_admin',
      emailVerified: true,
      phoneVerified: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // ─── Seller Users ───────────────────────────────────────────────────────
  const sellerPassword = await bcrypt.hash('seller123456', 12);

  const sellerUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'samsung@jenga.co.ke' },
      update: {},
      create: { email: 'samsung@jenga.co.ke', phone: '+254700000010', name: 'Samsung Kenya', passwordHash: sellerPassword, role: 'seller', emailVerified: true, phoneVerified: true },
    }),
    prisma.user.upsert({
      where: { email: 'avechi@jenga.co.ke' },
      update: {},
      create: { email: 'avechi@jenga.co.ke', phone: '+254700000011', name: 'Avechi Electronics', passwordHash: sellerPassword, role: 'seller', emailVerified: true, phoneVerified: true },
    }),
    prisma.user.upsert({
      where: { email: 'istore@jenga.co.ke' },
      update: {},
      create: { email: 'istore@jenga.co.ke', phone: '+254700000012', name: 'iStore Kenya', passwordHash: sellerPassword, role: 'seller', emailVerified: true, phoneVerified: true },
    }),
  ]);
  console.log(`✅ ${sellerUsers.length} seller users created`);

  // ─── Sellers ────────────────────────────────────────────────────────────
  const sellers = await Promise.all([
    prisma.seller.upsert({
      where: { userId: sellerUsers[0].id },
      update: {},
      create: {
        userId: sellerUsers[0].id, businessName: 'Samsung Kenya Official', slug: 'samsung-kenya-official',
        description: 'Official Samsung Kenya store — genuine products with full warranty.',
        badge: 'authorized', status: 'active', verified: true, rating: 4.9, salesCount: 3240,
        productCount: 48, location: 'Nairobi CBD', county: 'Nairobi', responseTime: '< 1 hour', commissionRate: 5.0,
      },
    }),
    prisma.seller.upsert({
      where: { userId: sellerUsers[1].id },
      update: {},
      create: {
        userId: sellerUsers[1].id, businessName: 'Avechi Electronics', slug: 'avechi-electronics',
        description: "Kenya's largest authorised electronics dealer with 10+ brands.",
        badge: 'authorized', status: 'active', verified: true, rating: 4.8, salesCount: 2190,
        productCount: 120, location: 'Westlands, Nairobi', county: 'Nairobi', responseTime: '< 2 hours', commissionRate: 7.0,
      },
    }),
    prisma.seller.upsert({
      where: { userId: sellerUsers[2].id },
      update: {},
      create: {
        userId: sellerUsers[2].id, businessName: 'iStore Kenya', slug: 'istore-kenya',
        description: 'Authorised Apple Premium Reseller in Kenya.',
        badge: 'authorized', status: 'active', verified: true, rating: 4.9, salesCount: 1870,
        productCount: 30, location: 'The Junction Mall', county: 'Nairobi', responseTime: '< 1 hour', commissionRate: 5.0,
      },
    }),
  ]);
  console.log(`✅ ${sellers.length} sellers created`);

  // ─── Categories ─────────────────────────────────────────────────────────
  const categories = await Promise.all(
    templateCategories.map((cat: any) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          icon: cat.icon,
          sortOrder: cat.sortOrder,
          isActive: true,
        },
      }),
    ),
  );
  console.log(`✅ ${categories.length} categories created`);

  // ─── Sample Products ────────────────────────────────────────────────────
  const smartphonesCategory = categories.find((c) => c.slug === 'smartphones')!;
  const laptopsCategory = categories.find((c) => c.slug === 'laptops')!;
  const tvsCategory = categories.find((c) => c.slug === 'televisions')!;

  const sampleProducts = [
    {
      sellerId: sellers[0].id, categoryId: smartphonesCategory.id,
      name: 'Samsung Galaxy S24 Ultra', slug: 'samsung-galaxy-s24-ultra', brand: 'Samsung',
      description: 'The Samsung Galaxy S24 Ultra redefines flagship performance with Snapdragon 8 Gen 3, 200MP camera, and built-in S Pen.',
      price: 139999, compareAtPrice: 159999, status: 'active',
      features: ['200MP quad-camera', 'Built-in S Pen', 'Snapdragon 8 Gen 3', '6.8" Dynamic AMOLED 2X', '5000mAh battery'],
      specifications: { Display: '6.8" Dynamic AMOLED 2X', Processor: 'Snapdragon 8 Gen 3', RAM: '12GB', Storage: '256GB', Camera: '200MP + 12MP + 50MP + 10MP', Battery: '5000mAh' },
      tags: ['5G', 'S Pen', 'AI Camera', 'Flagship'], warranty: '12 months Samsung Kenya warranty',
      stockCount: 15, bnplAvailable: true, monthlyInstallment: 11667, isFeatured: true, deliveryEstimate: '1-2 business days',
    },
    {
      sellerId: sellers[2].id, categoryId: smartphonesCategory.id,
      name: 'iPhone 15 Pro', slug: 'iphone-15-pro', brand: 'Apple',
      description: 'The iPhone 15 Pro features titanium design, A17 Pro chip, and 48MP camera system.',
      price: 174999, compareAtPrice: 189999, status: 'active',
      features: ['A17 Pro chip', 'Titanium frame', '48MP camera', 'Action button', 'USB-C'],
      specifications: { Display: '6.1" Super Retina XDR', Chip: 'A17 Pro', RAM: '8GB', Storage: '256GB', Camera: '48MP + 12MP + 12MP' },
      tags: ['A17 Pro', 'Titanium', 'Premium'], warranty: '12 months Apple Kenya warranty',
      stockCount: 8, bnplAvailable: true, monthlyInstallment: 14583, isFeatured: true, deliveryEstimate: '1-2 business days',
    },
    {
      sellerId: sellers[1].id, categoryId: laptopsCategory.id,
      name: 'Apple MacBook Air M3', slug: 'macbook-air-m3', brand: 'Apple',
      description: "The world's best consumer laptop. Fanless, silent, 18 hours battery.",
      price: 159999, compareAtPrice: 174999, status: 'active',
      features: ['Apple M3 chip', '18 hours battery', '13.6" Liquid Retina', 'Fanless design'],
      specifications: { Display: '13.6" Liquid Retina', Chip: 'Apple M3', RAM: '8GB', Storage: '256GB SSD', Battery: 'Up to 18h' },
      tags: ['M3', 'Ultralight', 'Fanless'], warranty: '12 months Apple warranty',
      stockCount: 12, bnplAvailable: true, monthlyInstallment: 13333, isFeatured: true, deliveryEstimate: '1-2 business days',
    },
    {
      sellerId: sellers[0].id, categoryId: tvsCategory.id,
      name: 'Samsung 55" Crystal UHD 4K Smart TV', slug: 'samsung-55-crystal-uhd-4k', brand: 'Samsung',
      description: 'Stunning 4K UHD picture quality with Crystal Processor 4K and Smart Hub.',
      price: 62999, compareAtPrice: 79999, status: 'active',
      features: ['Crystal Processor 4K', 'Smart Hub', 'AirSlim Design', 'Adaptive Sound'],
      specifications: { 'Display Size': '55"', Resolution: '4K UHD (3840x2160)', 'Panel Type': 'Crystal UHD', 'Smart TV': 'Tizen OS', 'HDMI Ports': '3' },
      tags: ['4K', 'Smart TV', 'Tizen'], warranty: '24 months Samsung warranty',
      stockCount: 20, bnplAvailable: true, monthlyInstallment: 5250, isFlashSale: true, flashSalePrice: 52999,
      requiresInstallation: true, installationFee: 2500, deliveryEstimate: '2-3 business days',
    },
  ];

  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product as any,
    });
  }
  console.log(`✅ ${sampleProducts.length} sample products created`);

  // ─── Buyer User ─────────────────────────────────────────────────────────
  const buyerPassword = await bcrypt.hash('buyer123456', 12);
  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@test.com' },
    update: {},
    create: {
      email: 'buyer@test.com',
      phone: '+254712345678',
      name: 'John Kamau',
      passwordHash: buyerPassword,
      role: 'buyer',
      emailVerified: true,
      phoneVerified: true,
    },
  });
  console.log('✅ Test buyer created:', buyer.email);

  console.log('\n🎵 Kora database seeded successfully!');
  console.log('───────────────────────────────────────');
  console.log('Admin login:  admin@jenga.co.ke / admin123456');
  console.log('Seller login: samsung@jenga.co.ke / seller123456');
  console.log('Buyer login:  buyer@test.com / buyer123456');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
