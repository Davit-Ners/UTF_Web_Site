import "dotenv/config";

import prisma from "../lib/prisma";

type SeedProduct = {
    slug: string;
    name: string;
    price: number;
    image: string | null;
    category: "apparel" | "music" | "accessories";
    badge?: "New" | "Limited" | "PreOrder";
    shortDesc: string;
    description: string;
    stock: number;
    featured: boolean;
};

const PRODUCTS: SeedProduct[] = [
    {
        slug: "tee-core-logo",
        name: "Core Logo Tee (Black)",
        price: 25,
        image: "/merch/core-tee.jpg",
        category: "apparel" as const,
        badge: "New",
        shortDesc: "Black tee with the Until They Fall core logo.",
        description: "Black tee with the Until They Fall core logo.",
        stock: 42,
        featured: true,
    },
    {
        slug: "hoodie-skull",
        name: "Skull Hoodie",
        price: 50,
        image: "/merch/skull-hoodie.png",
        category: "apparel" as const,
        badge: "Limited",
        shortDesc: "Thick black hoodie with front print and back artwork.",
        description: "Thick black hoodie with front print and back artwork.",
        stock: 18,
        featured: true,
    },
    {
        slug: "cd-debut",
        name: "Debut Album CD",
        price: 12,
        image: "/merch/cd-st.png",
        category: "music" as const,
        shortDesc: "Physical CD of our debut album Sent To Die.",
        description: "Physical CD of our debut album Sent To Die.",
        stock: 60,
        featured: true,
    },
    {
        slug: "stickers-pack",
        name: "Sticker Pack",
        price: 5,
        image: "/merch/stickers.png",
        category: "accessories" as const,
        shortDesc: "4 stickers: logo, artwork and symbols.",
        description: "4 stickers: logo, artwork and symbols.",
        stock: 100,
        featured: true,
    },
    {
        slug: "tee-artwork",
        name: "Album Artwork Tee",
        price: 28,
        image: null,
        category: "apparel" as const,
        shortDesc: "Full-color Sent To Die artwork on a black tee.",
        description: "Full-color Sent To Die artwork on a black tee.",
        stock: 25,
        featured: false,
    },
    {
        slug: "poster-a2",
        name: "Tour Poster A2",
        price: 10,
        image: null,
        category: "accessories" as const,
        shortDesc: "High quality A2 poster, matte finish.",
        description: "High quality A2 poster, matte finish.",
        stock: 40,
        featured: false,
    },
];

async function main() {
    const now = new Date();

    for (const [index, product] of PRODUCTS.entries()) {
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: {
                name: product.name,
                status: "ACTIVE",
                price: product.price,
                image: product.image,
                category: product.category,
                badge: product.badge,
                shortDesc: product.shortDesc,
                description: product.description,
                stock: product.stock,
                featured: product.featured,
                sortOrder: index,
                publishedAt: now,
            },
            create: {
                slug: product.slug,
                name: product.name,
                status: "ACTIVE",
                price: product.price,
                image: product.image,
                category: product.category,
                badge: product.badge,
                shortDesc: product.shortDesc,
                description: product.description,
                stock: product.stock,
                featured: product.featured,
                sortOrder: index,
                publishedAt: now,
            },
        });
    }

    const count = await prisma.product.count({
        where: { status: "ACTIVE" },
    });

    console.log(`Seeded merch products. Active products: ${count}`);
}

main()
    .catch((error) => {
        console.error("Merch seed failed.");
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
