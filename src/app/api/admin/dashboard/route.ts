// app/api/admin/dashboard/route.ts
import { NextResponse } from 'next/server'
import { db } from '../../../../../prisma/prisma';

export async function GET() {
    console.log('Dashboard API route called');
    try {
        console.log('Fetching total sales...');
        const totalSales = await db.order.aggregate({
            _sum: {
                totalPrice: true,
            },
        })
        console.log('Total sales fetched:', totalSales);

        console.log('Fetching total orders...');
        const totalOrders = await db.order.count()
        console.log('Total orders fetched:', totalOrders);

        console.log('Fetching active users...');
        const activeUsers = await db.user.count({
            where: { role: 'Customer' },
        })
        console.log('Active users fetched:', activeUsers);

        console.log('Fetching active vendors...');
        const activeVendors = await db.user.count({
            where: { role: 'Vendor' },
        })
        console.log('Active vendors fetched:', activeVendors);

        console.log('Fetching recent orders...');
        const recentOrders = await db.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: true },
        })
        console.log('Recent orders fetched:', recentOrders);

        console.log('Fetching sales data...');
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
        const salesData = await db.order.groupBy({
            by: ['createdAt'],
            where: {
                createdAt: {
                    gte: sixMonthsAgo,
                },
            },
            _sum: {
                totalPrice: true,
            },
        })
        console.log('Sales data fetched:', salesData);

        // Mock recent activities (replace with actual data when available)
        const recentActivities = [
            { id: '1', type: 'new_user', description: 'New user registered', time: '2 hours ago' },
            { id: '2', type: 'new_order', description: 'New order placed', time: '3 hours ago' },
            { id: '3', type: 'new_product', description: 'New product added', time: '5 hours ago' },
        ]

        const dashboardData = {
            totalSales: totalSales._sum.totalPrice || 0,
            totalOrders,
            activeUsers,
            activeVendors,
            recentOrders: recentOrders.map(order => ({
                id: order.id,
                user: `${order.user.firstname} ${order.user.lastname}`,
                amount: order.totalPrice,
                status: order.status,
            })),
            salesData: salesData.map(data => ({
                name: data.createdAt.toISOString().split('T')[0],
                sales: data._sum.totalPrice || 0,
            })),
            recentActivities,
        }

        console.log('Dashboard data prepared:', dashboardData);
        return NextResponse.json(dashboardData)
    } catch (error) {
        console.error('Error in dashboard API route:', error)
        // Log the full error stack trace
        console.error(error.stack)
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
    }
}