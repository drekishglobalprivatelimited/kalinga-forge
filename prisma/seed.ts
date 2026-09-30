import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { readFileSync } from "node:fs";
import path from "node:path";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "home-decor" },
      update: {},
      create: { name: "Home Decor", slug: "home-decor", sortOrder: 1 },
    }),
    prisma.category.upsert({
      where: { slug: "engineering-parts" },
      update: {},
      create: { name: "Engineering Parts", slug: "engineering-parts", sortOrder: 2 },
    }),
    prisma.category.upsert({
      where: { slug: "gifts" },
      update: {},
      create: { name: "Gifts & Collectibles", slug: "gifts", sortOrder: 3 },
    }),
    prisma.category.upsert({
      where: { slug: "functional" },
      update: {},
      create: { name: "Functional Parts", slug: "functional", sortOrder: 4 },
    }),
  ]);

  const [homeDecor, engineering, gifts, functional] = categories;

  // Products
  const products = [
    {
      name: "Geometric Wall Art — Hexagon",
      slug: "geometric-wall-art-hexagon",
      shortDesc: "Modern hexagonal wall panel in PLA. Set of 3.",
      description: "Minimalist hexagonal wall art panels, perfect for modern interiors. Printed in premium PLA with a smooth matte finish. Set of 3 interlocking panels.",
      categoryId: homeDecor.id,
      basePrice: 599,
      comparePrice: 799,
      sku: "HDA-HEX-001",
      stock: 25,
      isActive: true,
      isFeatured: true,
      material: "PLA",
      printTime: 4,
      tags: ["wall art", "decor", "geometric", "modern"],
    },
    {
      name: "Cable Management Clips — Pack of 10",
      slug: "cable-management-clips-10pk",
      shortDesc: "Self-adhesive cable organizer clips for desks and walls.",
      description: "Keep your workspace tidy with these versatile cable clips. Printed in durable PETG, each clip holds up to 3 cables. Pack of 10.",
      categoryId: functional.id,
      basePrice: 249,
      comparePrice: null,
      sku: "FNC-CBL-010",
      stock: 100,
      isActive: true,
      isFeatured: true,
      material: "PETG",
      printTime: 1,
      tags: ["cable", "organizer", "desk", "functional"],
    },
    {
      name: "Planetary Gear Fidget Toy",
      slug: "planetary-gear-fidget-toy",
      shortDesc: "Fully assembled, print-in-place planetary gear mechanism.",
      description: "A mesmerizing print-in-place planetary gear system. No assembly required — printed as a single piece. Great stress reliever and desktop toy.",
      categoryId: gifts.id,
      basePrice: 449,
      comparePrice: 599,
      sku: "GFT-PLG-001",
      stock: 40,
      isActive: true,
      isFeatured: true,
      material: "PLA+",
      printTime: 6,
      tags: ["fidget", "gear", "toy", "gift"],
    },
    {
      name: "M3 Hex Nut Trap Insert — 50pcs",
      slug: "m3-hex-nut-trap-insert-50pcs",
      shortDesc: "Precision M3 hex nut traps for embedded fasteners.",
      description: "Standard M3 hex nut trap inserts for embedding hardware in 3D prints. Exact fit for DIN 934 M3 hex nuts. Pack of 50.",
      categoryId: engineering.id,
      basePrice: 199,
      comparePrice: null,
      sku: "ENG-NUT-M3-050",
      stock: 200,
      isActive: true,
      isFeatured: false,
      material: "PETG",
      printTime: 2,
      tags: ["fastener", "hardware", "M3", "engineering"],
    },
    {
      name: "Desk Organizer — Modular System",
      slug: "desk-organizer-modular",
      shortDesc: "Stackable, modular desk organizer with pen holder and tray.",
      description: "A fully modular desk organizer system. Includes one pen holder, one business card slot, and one flat tray. Snap-together design — add more units as needed.",
      categoryId: homeDecor.id,
      basePrice: 799,
      comparePrice: 999,
      sku: "HDA-DSK-MOD-001",
      stock: 30,
      isActive: true,
      isFeatured: true,
      material: "PLA",
      printTime: 8,
      tags: ["desk", "organizer", "office", "modular"],
    },
    {
      name: "Phone Stand — Adjustable Angle",
      slug: "phone-stand-adjustable",
      shortDesc: "Adjustable angle phone stand, fits all phones up to 7 inches.",
      description: "Solid, stable phone stand with 5 adjustable angle positions. Compatible with all smartphones and small tablets up to 7 inches. Rubberized base pads prevent sliding.",
      categoryId: functional.id,
      basePrice: 349,
      comparePrice: null,
      sku: "FNC-PHN-STD-001",
      stock: 60,
      isActive: true,
      isFeatured: false,
      material: "PLA+",
      printTime: 3,
      tags: ["phone", "stand", "desk", "functional"],
    },
    {
      name: "Miniature Architecture — Taj Mahal",
      slug: "miniature-taj-mahal",
      shortDesc: "Highly detailed 15cm Taj Mahal miniature. Resin printed.",
      description: "Museum-quality miniature of the Taj Mahal, printed in high-resolution resin (SLA). Intricate details visible to the naked eye. Mounted on a display plinth.",
      categoryId: gifts.id,
      basePrice: 1299,
      comparePrice: 1599,
      sku: "GFT-TAJ-001",
      stock: 15,
      isActive: true,
      isFeatured: true,
      material: "Resin",
      printTime: 10,
      tags: ["miniature", "architecture", "gift", "resin", "india"],
    },
    {
      name: "Spool Holder — Filament Rack",
      slug: "spool-holder-filament-rack",
      shortDesc: "Wall-mounted filament spool holder for up to 4 spools.",
      description: "Space-efficient wall-mounted spool holder for 3D printing filament. Holds up to 4 standard 1kg spools. Hardware included.",
      categoryId: functional.id,
      basePrice: 649,
      comparePrice: null,
      sku: "FNC-SPL-WL-004",
      stock: 20,
      isActive: true,
      isFeatured: false,
      material: "PETG",
      printTime: 5,
      tags: ["spool", "filament", "3d printing", "storage"],
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  // Poka Print Studio catalogue — generated from products.xlsx by
  // Catalogue/Poka Prints/export_to_website.py
  await seedPokaCatalogue();

  // Admin user
  const adminHash = await bcrypt.hash("Admin@123", 12);
  await prisma.user.upsert({
    where: { email: "admin@pokaprintstudio.in" },
    update: {},
    create: {
      email: "admin@pokaprintstudio.in",
      name: "Admin",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  console.log("Seeding complete.");
  console.log("Admin login: admin@pokaprintstudio.in / Admin@123");
}

type CatalogueData = {
  categories: { name: string; slug: string; description: string | null; sortOrder: number }[];
  products: {
    name: string;
    slug: string;
    sku: string;
    category: string;
    shortDesc: string;
    description: string;
    basePrice: number;
    isFeatured: boolean;
    material: string;
    tags: string[];
    image: string | null;
  }[];
};

async function seedPokaCatalogue() {
  const file = path.join(process.cwd(), "prisma", "data", "poka-products.json");
  const data: CatalogueData = JSON.parse(readFileSync(file, "utf-8"));

  const categoryIds = new Map<string, string>();
  for (const cat of data.categories) {
    const fields = { name: cat.name, description: cat.description, sortOrder: cat.sortOrder };
    const row = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: fields,
      create: { ...fields, slug: cat.slug },
    });
    categoryIds.set(cat.name, row.id);
  }

  for (const { category, image, ...product } of data.products) {
    const fields = { ...product, categoryId: categoryIds.get(category)!, isActive: true };
    const row = await prisma.product.upsert({
      where: { slug: product.slug },
      update: fields,
      create: fields,
    });
    await prisma.productImage.deleteMany({ where: { productId: row.id } });
    if (image) {
      await prisma.productImage.create({
        data: { productId: row.id, url: image, altText: product.name, sortOrder: 0 },
      });
    }
  }

  console.log(`Poka catalogue: ${data.products.length} products in ${data.categories.length} categories.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
