// export type Product = { id:string; name:string; price:number; image:string; stock?: number; badge?: string };

export type ProductCategory = "apparel" | "music" | "accessories";

export type Product = {
    id: string;
    name: string;
    price: number;
    image: string;
    category: ProductCategory;
    badge?: "New" | "Limited" | "Pre-order";
    shortDesc?: string;
    stock?: number;
};

export const products: Product[] = [
//     { id:"tee-core", name:"Core Logo Tee (Black)", price:25, image:"/merch/core-tee.jpg" },
//     { id:"hoodie-skull", name:"Skull Hoodie", price:50, image:"/merch/skull-hoodie.png" },
//     { id:"cd-st", name:"Debut Album CD", price:12, image:"/merch/cd-st.png" },
//     { id:"sticker-pack", name:"Sticker Pack", price:5, image:"/merch/stickers.png" },
];
