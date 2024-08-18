import { NextRequest, NextResponse } from 'next/server';
import { useCurrentSession } from '@lib/use-session-server';
import { db } from '../../../../../../prisma/prisma';

export async function GET(req: NextRequest) {
    const session = await useCurrentSession();

    if (!session || session.user.role !== "Vendor") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const shop = await db.shop.findUnique({
            where: { userId: session.user.id },
            select: {
                shopName: true,
                description: true,
                logo: true,
                banner: true,
                address: {
                    select: {
                        country: true,
                        city: true,
                    }
                },
                shopSettings: {
                    select: {
                        phoneNumber: true,
                    }
                },
                user: {
                    select: {
                        email: true,
                    }
                }
            }
        });

        if (!shop) {
            return NextResponse.json({ error: "Shop not found" }, { status: 404 });
        }

        return NextResponse.json({
            shopName: shop.shopName,
            description: shop.description,
            logo: shop.logo,
            banner: shop.banner,
            country: shop.address?.country,
            city: shop.address?.city,
            email: shop.user.email,
            phone: shop.shopSettings?.phoneNumber,
        });
    } catch (error) {
        console.error("Error fetching shop details:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const session = await useCurrentSession();

    if (!session || session.user.role !== "Vendor") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { shopName, description, logo, banner, country, city, email, phone } = body;

        const updatedShop = await db.shop.update({
            where: { userId: session.user.id },
            data: {
                shopName,
                description,
                logo,
                banner,
                address: {
                    update: {
                        country,
                        city,
                    }
                },
                shopSettings: {
                    update: {
                        phoneNumber: phone,
                    }
                },
                user: {
                    update: {
                        email,
                    }
                }
            },
        });

        return NextResponse.json(updatedShop);
    } catch (error) {
        console.error("Error updating shop details:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// export async function POST(req: NextRequest) {
//     const session = await useCurrentSession();

//     if (!session || session.user.role !== "Vendor") {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     try {
//         const body = await req.json();
//         const { shopName, description, logo, banner, country, city, email, phone } = body;

//         const newShop = await db.shop.create({
//             data: {
//                 shopName,
//                 description,
//                 logo,
//                 banner,
//                 userId: session.user.id,
//                 address: {
//                     create: {
//                         country,
//                         city,
//                     }
//                 },
//                 shopSettings: {
//                     create: {
//                         phoneNumber: phone,
//                     }
//                 },
//                 user: {
//                     connect: { id: session.user.id }
//                 }
//             },
//         });

//         return NextResponse.json(newShop, { status: 201 });
//     } catch (error) {
//         console.error("Error creating shop:", error);
//         return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//     }
// }

export async function PATCH(req: NextRequest) {
    const session = await useCurrentSession();

    if (!session || session.user.role !== "Vendor") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();

        const updatedShop = await db.shop.update({
            where: { userId: session.user.id },
            data: {
                ...body,
                address: body.country || body.city ? {
                    update: {
                        country: body.country,
                        city: body.city,
                    }
                } : undefined,
                shopSettings: body.phone ? {
                    update: {
                        phoneNumber: body.phone,
                    }
                } : undefined,
                user: body.email ? {
                    update: {
                        email: body.email,
                    }
                } : undefined
            },
        });

        return NextResponse.json(updatedShop);
    } catch (error) {
        console.error("Error updating shop details:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}