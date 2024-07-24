// hooks/useDashboardData.ts
import { useQuery, UseQueryResult } from '@tanstack/react-query'
// import axios from '@utils/axiosInstance';
import axios from 'axios'

export interface Activity {
    id: string;
    type: 'new_user' | 'new_order' | 'new_product';
    description: string;
    time: string;
}

export interface DashboardData {
    totalSales: number;
    totalOrders: number;
    activeUsers: number;
    activeVendors: number;
    recentOrders: Array<{
        id: string;
        user: string;
        amount: number;
        status: string;
    }>;
    salesData: Array<{
        name: string;
        sales: number;
    }>;
    recentActivities: Activity[];
}

const fetchDashboardData = async (): Promise<DashboardData> => {
    console.log('Fetching dashboard data...');
    try {
        const response = await axios.get<DashboardData>('/api/admin/dashboard', {
            timeout: 10000, // 10 seconds timeout
        });
        console.log('API Response:', response);
        console.log('Dashboard data received:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                console.error('Error response headers:', error.response.headers);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
        }
        throw error;
    }
}

export const useDashboardData = (): UseQueryResult<DashboardData, Error> => {
    return useQuery<DashboardData, Error, DashboardData>({
        queryKey: ['dashboardData'],
        queryFn: fetchDashboardData,
        retry: 1,
        refetchOnWindowFocus: false,
    });
}