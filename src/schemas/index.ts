import { z } from "zod";
import * as yup from "yup";

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



export const shopAddressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});



// Address sub-schema
export const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string(),
});

// Payment info sub-schema
export const paymentInfoSchema = z.object({
  accountName: z.string().min(1, "Account name is required"),
  accountNumber: z.string()
    .regex(/^\d{10,11}$/, "Account number must be 10 or 11 digits")
    .refine((value) => value.length >= 10 && value.length <= 11, {
      message: "Account number must be 10 or 11 digits long",
    }),
  bankName: z.string().min(1, "Bank name is required"),
});

// Shop settings sub-schema
export const shopSettingsSchema = z.object({
  phoneNumber: z.string(),
  website: z.string(),
  businessHours: z.string().optional(),
  category: z.string().optional(),
  deliveryOptions: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

// Main shop schema
export const shopSchema = z.object({
  id: z.string().optional(),
  shopName: z.string(),
  description: z.string(),
  logo: z.string(),
  banner: z.string(),
  slug: z.string(),
  address: addressSchema,
  paymentInfo: paymentInfoSchema,
  shopSettings: shopSettingsSchema,
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  hasPaid: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  userId: z.string().optional(),
});

// You can also export the sub-schemas if you need to use them separately
// export { addressSchema, paymentInfoSchema, shopSettingsSchema };

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
  gallery: z.array(z.string().url()).optional(),
  // author_id: z.string().optional(),
  ratings: z.number().min(0).max(5).optional(),
  total_reviews: z.number().optional(),
  my_review: z.string().optional(),
  in_wishlist: z.boolean().optional(),
  categories: z.array(z.string()).optional(),
  // shop_id: z.string(),
  shop_name: z.string().optional(),
  isFlashDeal: z.boolean().optional(),
  discountPercentage: z.number().min(0).max(100).nullable().optional(),
  brandId: z.string().optional(),
});


export const shippingSchema = z.object({
  name: z.string().nonempty("Name is required"),
  address: z.string().nonempty("Address is required"),
  city: z.string().nonempty("City is required"),
  state: z.string().nonempty("State is required"),
  zip: z.string().nonempty("ZIP code is required"),
});

export const adminLoginSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password must not exceed 100 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
});

export const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  slug: yup.string().required("Slug is required"),
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be positive"),
  sale_price: yup.number().positive("Sale price must be positive"),
  sku: yup.number().required("SKU is required"),
  quantity: yup
    .number()
    .required("Quantity is required")
    .positive("Quantity must be positive"),
  in_stock: yup.boolean().required("In Stock status is required"),
  is_taxable: yup.boolean().required("Taxable status is required"),
  status: yup
    .string()
    .oneOf(["Draft", "Published", "Suspended", "OutOfStock"])
    .required("Status is required"),
  product_type: yup
    .string()
    .oneOf(["Simple", "Variable"])
    .required("Product type is required"),
  image: yup.string().required("Product image is required"),
  gallery: yup.array().of(yup.string()),
  categories: yup.array().min(1, "At least one category is required"),
  brandId: yup.string().nullable(),
  isFlashDeal: yup.boolean().notRequired(),
  discountPercentage: yup
    .number()
    .nullable()
    .min(0)
    .max(100)
    .when("isFlashDeal", {
      is: true,
      then: (schema) =>
        schema.required("Discount percentage is required for flash deals"),
      otherwise: (schema) => schema.notRequired(),
    }),
});



export type AdminLoginInput = z.infer<typeof adminLoginSchema>;