import { z } from "zod";
export const signupSchema = z
  .object({
    firstname: z.string().min(1, 'Username is required').max(100),
    lastname: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
    role: z.literal('Vendor').or(z.literal('Customer')).or(z.literal('Admin')).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password do not match',
  });

    export const loginSchema: any = z.object({
        email: z.string().min(2, {
          message: "email must be at least 2 characters.",
        }),
        password: z.string().min(2, {
          message: "password must be at least 2 characters.",
        }),
      });

    export const ResetSchema: any = z.object({
        email: z.string().email({
          message: "email must be a valid email.",
        }),
      });

    export const NewPasswordSchema: any = z.object({
        password: z.string().min(6, {
          message: "This password does not exist",
        }),
      });
      
      export const addPaymentSchema = z.object({
        accountName: z.string().min(2, {
          message: "Bank Name cannot be empty",
        }),
        bankName: z.string().min(10, {
          message: "Please provide your bank name.",
        }),
        accountNo: z.string()
          .min(2, {
            message: "Provided account number is not a valid account number.",
          })
          .max(12, {
            message: "Provided account number exceeds the maximum length.",
          }),
      });

      export const shopSettingsSchema = z.object({
        phoneNumber: z.string().min(1, {
          message: "Phone number is required.",
        }),
        website: z.string().min(2, {
          message: "website must be at least 2 characters.",
        }),
      });
      
      
export const shopAddressSchema = z.object({
  country: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  city: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  state: z.string().min(10, {
    message: "Please provide your bank name.",
  }),
  zip: z
    .string()
    .min(2, {
      message: "Provided accound number is not a valid account number.",
    })
    .max(6, {
      message: "Provided account number exceeds the maximum length.",
    }),
  address: z.string().min(2, {
    message: "Please provide your physical address.",
  }),
});


export const shopSchema = z.object({
  id: z.string().optional(),
  shopname: z.string(),
  description: z.string(),
  address: z.string(),
  logo: z.string(),
  banner: z.string(),
  slug: z.string(),
  bankName: z.string(),
  accountNo: z.string(),
  country: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  phoneNumber: z.string(),
  website: z.string(),
  accountName: z.string(),
});

      export const searchInputSchema = z.object({
        search: z.string().min(2, {
          message: "The input cannot be less than 2 characters",
        }),
      })

      export const categorySchema = z.object({
        name: z.string().min(2, {
          message: "Username must be at least 2 characters.",
        }),
        slug: z.string().min(2, {
          message: "slug must be at least 2 characters.",
        }),
      });

      export const paymentSchema = z.object({
        email: z.string().min(2, {
            message: "email must be at least 2 characters.",
          }),
      })

      export const productSchema = z.object({
        name: z.string().min(1, "Name is required"),
        slug: z.string(),
        description: z.string(),
        price: z.number().min(0, "Price must be a positive number"),
        sale_price: z.number(),
        sku: z.number(),
        quantity: z.number().min(0, "Quantity must be a non-negative number"),
        in_stock: z.boolean(),
        is_taxable: z.boolean(),
        status: z.enum(['Draft', 'Published', 'Suspended', 'OutOfStock']),
        product_type: z.enum(['Simple', 'Variable']),
        image: z.string().url().optional(),
        video: z.string().url().optional(),
        gallery: z.array(z.string().url()).optional(),
        // author_id: z.string().optional(),
        ratings: z.number().min(0).max(5).optional(),
        total_reviews: z.number().optional(),
        my_review: z.string().optional(),
        in_wishlist: z.boolean().optional(),
        categories: z.array(z.string()).optional(),
        // shop_id: z.string(),
        shop_name: z.string().optional(),
      });
      

      export const shippingSchema = z.object({
        name: z.string().nonempty("Name is required"),
        address: z.string().nonempty("Address is required"),
        city: z.string().nonempty("City is required"),
        state: z.string().nonempty("State is required"),
        zip: z.string().nonempty("ZIP code is required"),
      });

// Corresponding TypeScript type derived from the schema
// export type ProductType = z.infer<typeof productSchema>;

      
      // Export the type inferred from the schema