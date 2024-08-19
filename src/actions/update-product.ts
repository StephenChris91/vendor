'use server'

// actions/updateProduct.ts

import { useCurrentSession, useCurrentUser } from "@lib/use-session-server";
import { db } from "../../prisma/prisma";



export async function updateProduct(productId: string, productData: any) {
    try {
        const session = await useCurrentSession()

        if (!session || !session.user || session.user.role !== "Vendor") {
            return { status: "error", message: "Unauthorized" };
        }

        const updatedProduct = await db.product.update({
            where: { id: productId },
            data: {
                name: productData.name,
                slug: productData.slug,
                description: productData.description,
                price: productData.price,
                sale_price: productData.sale_price,
                sku: productData.sku,
                quantity: productData.quantity,
                in_stock: productData.in_stock,
                is_taxable: productData.is_taxable,
                status: productData.status,
                product_type: productData.product_type,
                image: productData.image,
                gallery: productData.gallery,
                brandId: productData.brandId,
                isFlashDeal: productData.isFlashDeal,
                discountPercentage: productData.discountPercentage,
                categories: {
                    deleteMany: {},
                    create: productData.categories.map((catId: string) => ({
                        categoryId: catId,
                    })),
                },
            },
        });

        return { status: "success", data: updatedProduct };
    } catch (error) {
        console.error("Error updating product:", error);
        return { status: "error", message: "Failed to update product" };
    }
}