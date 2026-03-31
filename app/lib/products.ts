export type ProductCategory = "apparel" | "music" | "accessories";
export type ProductBadge = "New" | "Limited" | "Pre-order";

export type Product = {
    id: string;
    name: string;
    price: number;
    image?: string;
    category: ProductCategory;
    badge?: ProductBadge;
    shortDesc?: string;
    stock?: number;
};

export type CartItem = {
    product: Product;
    quantity: number;
};
