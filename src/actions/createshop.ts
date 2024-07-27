'use server';
import { paymentInfoSchema, shopAddressSchema, shopSettingsSchema } from './../schemas/index';
// actions/createshop.ts

import { shopSchema } from "schemas";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "auth";
import { ShopStatus } from '@prisma/client';
import { db } from '../../prisma/prisma';

// Extend the shopSchema to include nested objects and additional fields
const extendedShopSchema = shopSchema.extend({
    address: shopAddressSchema,
    paymentInfo: paymentInfoSchema,
    shopSettings: shopSettingsSchema,
    status: z.nativeEnum(ShopStatus), // Use the Prisma-generated enum
    hasPaid: z.boolean(),
});


export async function createShop(values: z.infer<typeof extendedShopSchema>) {
    const session = await auth();

    if (!session?.user) {
        return { status: 'error', error: 'User not authenticated' };
    }

    const validInput = extendedShopSchema.safeParse(values);

    if (!validInput.success) {
        console.error("Validation errors:", validInput.error.errors);
        return {
            status: 'error',
            error: 'Invalid form data',
            details: validInput.error.errors
        };
    }

    const {
        shopName,
        description,
        address,
        logo,
        banner,
        slug,
        status,
        paymentInfo,
        shopSettings,
    } = validInput.data;

    try {
        const shop = await db.shop.create({
            data: {
                shopName,
                description,
                logo,
                banner,
                slug,
                status,
                user: {
                    connect: { id: session.user.id },
                },
                address: {
                    create: {
                        street: address.street || "",
                        city: address.city || "",
                        state: address.state || "",
                        postalCode: address.postalCode || "",
                        country: address.country || "",
                    },
                },
                paymentInfo: {
                    create: {
                        accountName: paymentInfo.accountName || "",
                        accountNo: paymentInfo.accountNumber || "", // Changed from accountNumber to accountNo
                        bankName: paymentInfo.bankName || "",
                    },
                },
                shopSettings: {
                    create: {
                        phoneNumber: shopSettings.phoneNumber || "",
                        website: shopSettings.website || "",
                        businessHours: shopSettings.businessHours || "",
                        category: shopSettings.category || "",
                        deliveryOptions: shopSettings.deliveryOptions || [],
                        isActive: shopSettings.isActive ?? true,
                    },
                },
            },
            include: {
                address: true,
                paymentInfo: true,
                shopSettings: true,
            },
        });

        // Update user's paid and onboarded status
        await db.user.update({
            where: { id: session.user.id },
            data: {
                hasPaid: true,
                isOnboardedVendor: false, // Set to true after document verification
            },
        });

        revalidatePath('/');
        return { status: 'success', shop };
    } catch (error) {
        console.error(error);
        return { status: 'error', message: 'Failed to create shop' };
    }
}