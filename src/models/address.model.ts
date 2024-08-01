import { user } from "@prisma/client";

interface Address {
  id: string;
  title: string;
  street: string;
  city: string;
  state?: string;
  country: string;
  zipCode?: string;
  phone?: string;
  isDefault: boolean;
  userId: string;
  user?: user;
  createdAt: Date;
  updatedAt: Date;
}

export default Address;