import { db } from "../../../../../../prisma/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const product = await db.product.create({
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description,
                price: body.price,
                sale_price: body.sale_price,
                quantity: body.quantity,
                status: body.status,
                product_type: body.product_type,
                shop: body.shop_id ? { connect: { id: body.shop_id } } : undefined,
                user: body.author_id ? { connect: { id: body.author_id } } : undefined,
                categories: {
                    connect: body.category_ids?.map((id: string) => ({ id })) || [],
                },
            },
        });
        return Response.json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        return Response.json({ error: 'Error creating product' }, { status: 500 });
    }
}