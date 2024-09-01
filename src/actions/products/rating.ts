// actions/products.ts
import { useCurrentSession } from "@lib/use-session-server";
import { db } from "../../../prisma/prisma";

export async function rateProduct(productId: string, rating: number, comment: string = "") {
    const session = await useCurrentSession();
    if (!session?.user?.id) {
        throw new Error("You must be logged in to rate a product");
    }

    const userId = session.user.id;

    try {
        const updatedRating = await db.rating.upsert({
            where: {
                userId_productId: { userId, productId },
            },
            update: {
                rating: rating,
                comment: comment,
            },
            create: {
                userId: userId,
                productId: productId,
                rating: rating,
                comment: comment,
            },
        });

        // Update the product's average rating
        const productRatings = await db.rating.findMany({
            where: { productId: productId },
            select: { rating: true },
        });

        const averageRating =
            productRatings.reduce((sum, r) => sum + r.rating, 0) / productRatings.length;

        await db.product.update({
            where: { id: productId },
            data: {
                ratings: averageRating,
                total_reviews: productRatings.length,
            },
        });

        return updatedRating;
    } catch (error) {
        console.error("Error rating product:", error);
        throw new Error("Failed to rate product");
    }
}

export async function getProductRating(id: string): Promise<number> {
    try {
        const product = await db.product.findUnique({
            where: { id: id },
            select: { ratings: true },
        });

        if (!product) {
            throw new Error("Product not found");
        }

        return product.ratings || 0;
    } catch (error) {
        console.error("Error fetching product rating:", error);
        throw new Error("Failed to fetch product rating");
    }
}