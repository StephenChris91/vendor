// actions/deleteVendor.ts

import axios from 'axios'; // or your preferred HTTP client
import { db } from '../../prisma/prisma';
db
export const deleteVendor = async (vendorId: string): Promise<void> => {
    try {
        await axios.delete(`/api/admin/vendors/${vendorId}`);
    } catch (error) {
        console.error('Error deleting vendor:', error);
        throw error;
    }
};