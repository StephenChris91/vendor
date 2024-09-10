'use server';
import { addressSchema, paymentInfoSchema, shopAddressSchema, shopSettingsSchema } from './../schemas/index';
import { shopSchema } from "schemas";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "auth";
import { ShopStatus, Prisma } from '@prisma/client';
import { db } from '../../prisma/prisma';

// Extend the shopSchema to include nested objects and additional fields
const extendedShopSchema = shopSchema.extend({
    address: addressSchema,
    paymentInfo: paymentInfoSchema,
    shopSettings: shopSettingsSchema,
    status: z.nativeEnum(ShopStatus),
    hasPaid: z.boolean(),
    category: z.string(), // Changed from categoryName to category
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
        category, // Changed from categoryName to category
    } = validInput.data;

    try {
        // // First, find or create the category
        // let categoryRecord = await db.category.findFirst({
        //     where: { name: category },
        // });

        // if (!categoryRecord) {
        //     categoryRecord = await db.category.create({
        //         data: {
        //             name: category,
        //             slug: category.toLowerCase().replace(/\s+/g, '-'),
        //         },
        //     });
        // }

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
                        street: address.street,
                        city: address.city,
                        state: address.state,
                        postalCode: address.postalCode,
                        country: address.country,
                    },
                },
                paymentInfo: {
                    create: {
                        accountName: paymentInfo.accountName,
                        accountNumber: paymentInfo.accountNumber,
                        bankName: paymentInfo.bankName,
                    },
                },
                shopSettings: {
                    create: {
                        phoneNumber: shopSettings.phoneNumber,
                        website: shopSettings.website,
                        businessHours: shopSettings.businessHours,
                        category: shopSettings.category,
                        deliveryOptions: shopSettings.deliveryOptions,
                        isActive: shopSettings.isActive,
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
                // hasPaid: true,
                isOnboardedVendor: false, // Set to true after document verification
            },
        });

        revalidatePath('/');
        return { status: 'success', shop, message: 'Shop has been created successfully' };
    } catch (error) {
        console.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return { status: 'error', message: `Database error: ${error.message}` };
        }
        return { status: 'error', message: 'Failed to create shop' };
    }
}