'use server';

import { revalidateTag } from "next/cache";
import { z } from "zod";
import { db } from "../../prisma/prisma";
import { categorySchema } from "schemas";

export const createCategory = async (values: z.infer<typeof categorySchema>) => {
  const validInput = categorySchema.safeParse(values);

  if (!validInput.success) {
    return { error: 'Invalid details provided' };
  }

  const { name, slug } = validInput.data;

  const existingCategory = await getCategoryBySlug(slug);
  if (existingCategory) {
    return { error: 'This category already exists!' };
  }

  try {
    await db.category.create({
      data: {
        name,
        slug,
      },
    });

    revalidateTag('category')
    return { success: 'Category Created' };
  } catch (error) {
    console.error(error);
    return { error: 'An error occurred while creating the category' };
  }

};


export const getCategoryBySlug = async (slug: string) => {
  const category = await db.category.findFirst({
    where: {
      slug
    }
  })

  return category
}

export const getAllCategories = async () => {
  return await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });
};

export const getCategoryById = async (id: string) => {
  const category = await db.category.findFirst({
    where: {
      id
    }
  })

  return category
}

//delete a category

export const deleteACategory = async (id: string) => {
  const category = await db.category.delete({
    where: {
      id
    }
  })

  revalidateTag('category')
  return category
}

//get categories by user

// export const getCategoriesByUser = async (userId: string) => {
//     const categories = await db.category.findMany({
//         where: {
//             user: {
//                 id: userId
//             }
//         }
//     })

//     return categories
// }