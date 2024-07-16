import { StaticImageData } from "next/image";
import { JSXElementConstructor } from "react";
import { JsxElement } from "typescript";

// export interface Product {
//     id: number;
//     name: string;
//     imageUrl: StaticImageData;
//     sale?: string;
//     price?: number;
// }

export interface catTitle {
    title: string;
}

export interface User {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    confirmPassword: string;
    role?: "Customer" | "Vendor" | "Admin";
    avatar?: HTMLFileInputElement;
}

export interface TabProps {
    title: string;
    content: JSXElement;
}

export type OrderProcessing = {
    id: string
    amount: number
    status: "pending" | "processing" | "success" | "failed"
    email: string
    trackingNumber: number
    customer: string
    productQty: number
    orderDate: string
    total: number
    actions?: JSXElement
}

export interface CartItemType {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

export type DraftProductType = {
    id: string,
    product: string,
    productType: "simple" | "variables",
    shop: string,
    quantity: number,
    status: "pendings" | "processing" | "success" | "failed",
}
export type InventoryType = {
    id: string,
    name: string,
    quantity: number,
    quantity_sold: number,
    sku: number
}
export type CategoriesType = {
    id?: string,
    name: string,
    slug: string,
}
export type TagsType = {
    id: string,
    name: string,
    icon: string,
    slug: string,
    group: string
}
export type TaxesType = {
    id: string,
    name: string,
    country: string,
    city: string,
    zip: string,
}
export type ShippingType = {
    id: string,
    name: string,
    amount: number,
    global: string,
    type: string,
}
export type WithdrawsType = {
    shipId: string,
    shop: string,
    created: string,
    payment_method: string,
    status: string,
}
export type RefundsReasonsType = {
    id: string,
    name: string,
    slug: string
}
export type ReportedRefundsType = {
    id: string,
    heading: string,
    description: string,
    applied_on: string,
    status: string,
}
export type RefundsPolicyType = {
    id: string,
    heading: string,
    description: string,
    applied_on: string,
    status: string,
}
export type PageGroupType = {
    id: string,
    homepage: string,
    slug: string,
    icon: string,
}
export type FAQsTYpe = {
    id: string,
    title: string,
    description: string,
    type: string,
    issued_by: string,
}
export type TermsAndConditionsType = {
    id: string,
    title: string,
    description: string,
    type: string,
    issued_by: string,
    status: string,
    approval_action: string,
}
export type OrdersType = {
    tracking_number: number,
    customer: JSXElement,
    products: number,
    order_date: string,
    delivery_fee: float,
    total: float,
    status: string,
}
export type TransactionType = {
    tracking_number: number,
    product_price: float,
    taxable_amount: float,
    discount: float,
    delivery_fee: float,
    payment_gateway: string,
    payment_status: string,
    total: number
}
export type AllUserType = {
    id: string,
    name: number,
    permissions: float,
    available_wallet_point: float,
    status: float,
}
export type AllVendorsTypes = {
    id: string,
    name: number,
    permissions: float,
    available_wallet_point: float,
    status: float,
}
export type AllPendingVendorsTypes = {
    id: string,
    name: number,
    permissions: float,
    available_wallet_point: float,
    status: float,
}
export type MyStaffTypes = {
    name: string,
    email: string,
    status: string,
}
export type VendorStaffTypes = {
    name: string,
    email: string,
    status: string,
}
export type CustomerTypes = {
    id: string,
    name: string,
    permissions: string,
    available_wallet_points: string,
    status: string
}
export type ReviewsType = {
    id: string,
    product: JsxElement,
    customer_review: JsxElement,
    rating: number,
    reports: string,
    date: string,
    status: string
}
export type QuestionsType = {
    id: string,
    image: JsxElement,
    question_and_answer: JsxElement,
    customer: string,
    feedbacks: JsxElement,
    date: string,
}
export interface CartTableType {
    id: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
    logo?: string; // optional, assuming products might have a logo or image
}


export type shopType = {
    id?: string;
    shopname: string;
    description: string;
    address: string;
    logo: string;
    banner: string;
    slug: string;
    bankName: string;
    accountNo: string;
    country: string;
    city: string;
    state: string;
    zip: string;
    phoneNumber: string;
    website: string;
    accountName: string;
    products?: ProductType[];
    user?: User
};

export type ShopWithProducts = shop & {
    products: ProductType[];
};

export interface ProductType {
    id?: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    sale_price: number;
    sku: number;
    quantity: number;
    in_stock: boolean | null;
    is_taxable: boolean;
    image?: string;
    video?: string;
    gallery?: string[];
    ratings?: number;
    total_reviews?: number;
    my_review?: string;
    in_wishlist?: boolean;
    categories?: string[];
    shop?: shopType;
    status: 'Draft' | 'Published' | 'Suspended' | 'OutOfStock';
    product_type: 'Simple' | 'Variable';
    user?: User;
    [key: string]: any;
}

export interface CartItem {
    id: string;
    product: ProductType;
    price: number;
    quantity: number;
    subtotal?: number;
    name?: string;
    image: string;
    description: string
}





