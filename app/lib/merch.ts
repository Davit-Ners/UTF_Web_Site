import prisma from "@/lib/prisma";
import type { Product, ProductBadge } from "./products";

function mapBadge(
    badge: "New" | "Limited" | "PreOrder" | null
): ProductBadge | undefined {
    if (!badge) return undefined;
    if (badge === "PreOrder") return "Pre-order";
    return badge;
}

export async function getActiveMerchProducts(limit?: number): Promise<Product[]> {
    const dbProducts = await prisma.product.findMany({
        where: {
            status: "ACTIVE",
        },
        orderBy: [
            { featured: "desc" },
            { sortOrder: "asc" },
            { publishedAt: "desc" },
            { createdAt: "desc" },
        ],
        ...(limit ? { take: limit } : {}),
        select: {
            id: true,
            name: true,
            price: true,
            image: true,
            category: true,
            badge: true,
            shortDesc: true,
            stock: true,
        },
    });

    return dbProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image ?? undefined,
        category: product.category,
        badge: mapBadge(product.badge),
        shortDesc: product.shortDesc ?? undefined,
        stock: product.stock ?? undefined,
    }));
}
