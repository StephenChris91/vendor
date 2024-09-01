// app/actions/products/getServerSideProductData.ts
import { getProductRating } from './rating';

export async function getServerSideProductData(id: string) {
    try {
        const rating = await getProductRating(id);
        return { rating, error: null };
    } catch (error) {
        console.error("Error fetching product rating:", error);
        return { rating: 0, error: "Failed to fetch product rating" };
    }
}