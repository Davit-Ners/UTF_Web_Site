export type Concert = { id:string; date:string; city:string; venue:string; ticketUrl?:string; note?:string };
export const concerts: Concert[] = [
    { id:"utf-arlon", date:"2025-12-05", city:"Arlon, BE", venue:"L’Entrepôt", ticketUrl:"https://tickets.example.com/utf-arlon" },
    { id:"utf-bxl", date:"2026-01-10", city:"Bruxelles, BE", venue:"VK", ticketUrl:"https://tickets.example.com/utf-bxl", note:"with Special Guests" },
];
