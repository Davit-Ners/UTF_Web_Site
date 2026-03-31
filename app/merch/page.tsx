import MerchHero from "../components/merch/merchHero/merchHero";
import { getActiveMerchProducts } from "../lib/merch";
import MerchStoreClient from "./merchStoreClient";

export const revalidate = 60;

export default async function MerchPage() {
    const products = await getActiveMerchProducts();

    return (
        <main>
            <MerchHero />
            <MerchStoreClient products={products} />
        </main>
    );
}
