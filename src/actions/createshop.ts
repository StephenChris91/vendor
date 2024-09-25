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
    hasPaid: z.boolean().optional(), // Optional in case not provided
    category: z.string(),
});

export async function createOrUpdateShop(values: z.infer<typeof extendedShopSchema>) {
    const session = await auth();

    if (!session?.user?.id) {
        return { status: 'error', error: 'User not authenticated or User ID not found in session' };
    }

    // Clean the values to remove undefined or optional fields
    const cleanedValues = Object.fromEntries(Object.entries(values).filter(([_, v]) => v !== undefined));

    console.log("Cleaned Values: ", cleanedValues); // Log cleaned values for debugging

    const validInput = extendedShopSchema.safeParse(cleanedValues);

    if (!validInput.success) {
        console.error("Validation errors:", validInput.error.errors); // Log detailed validation errors
        return {
            status: 'error',
            error: 'Invalid form data',
            details: validInput.error.errors // Include error details
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
        category,
    } = validInput.data;

    try {
        // Check if the user already has a shop
        const existingShop = await db.shop.findUnique({
            where: { userId: session.user.id },
        });

        let shop;
        if (existingShop) {
            // Update existing shop
            shop = await db.shop.update({
                where: { id: existingShop.id },
                data: {
                    shopName,
                    description,
                    logo,
                    banner,
                    slug,
                    status,
                    address: {
                        update: {
                            street: address.street,
                            city: address.city,
                            state: address.state,
                            postalCode: address.postalCode,
                            country: address.country,
                        },
                    },
                    paymentInfo: {
                        update: {
                            accountName: paymentInfo.accountName,
                            accountNumber: paymentInfo.accountNumber,
                            bankName: paymentInfo.bankName,
                        },
                    },
                    shopSettings: {
                        update: {
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
        } else {
            // Create new shop
            shop = await db.shop.create({
                data: {
                    shopName,
                    description,
                    logo,
                    banner,
                    slug,
                    status,
                    userId: session.user.id,
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
        }

        // Update user's paid and onboarded status
        await db.user.update({
            where: { id: session.user.id },
            data: {
                isOnboardedVendor: false, // Set to true after document verification
            },
        });

        revalidatePath('/');
        return {
            status: 'success',
            shop,
            message: existingShop ? 'Shop has been updated successfully' : 'Shop has been created successfully'
        };
    } catch (error) {
        console.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return { status: 'error', message: `Database error: ${error.message}` };
        }
        return { status: 'error', message: 'Failed to create or update shop' };
    }
}
