export type Product = { id:string; name:string; price:number; image:string };
export const products: Product[] = [
    { id:"tee-core", name:"Core Logo Tee (Black)", price:25, image:"/merch/core-tee.jpg" },
    { id:"hoodie-skull", name:"Skull Hoodie", price:50, image:"/merch/skull-hoodie.jpg" },
    { id:"cd-st", name:"Debut Album CD", price:12, image:"/merch/cd-st.jpg" },
    { id:"sticker-pack", name:"Sticker Pack", price:5, image:"/merch/stickers.jpg" },
];
