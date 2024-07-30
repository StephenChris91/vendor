// // app/api/frequently-bought-products/route.ts
// import { NextResponse } from 'next/server';
// import { db } from '../../../../../prisma/prisma';

// export async function GET() {
//   try {
//     // First, get the most frequently ordered products
//     const topProducts = await db.orderItem.groupBy({
//       by: ['productId'],
//       _count: {
//         _all: true,
//       },
//       orderBy: {
//         _count: {
//           _all: 'desc',
//         },
//       },
//       take: 10,
//     });

//     const frequentlyBoughtTogether = await Promise.all(
//       topProducts.map(async (item) => {
//         // For each top product, find orders containing it
//         const orders = await prisma.order.findMany({
//           where: {
//             orderItems: {
//               some: {
//                 productId: item.productId,
//               },
//             },
//           },
//           include: {
//             orderItems: {
//               include: {
//                 product: {
//                   include: {
//                     categories: true,
//                     shop: true,
//                   },
//                 },
//               },
//             },
//           },
//           take: 100, // Limit to last 100 orders for performance
//         });

//         // Count occurrences of other products in these orders
//         const productCounts = orders.flatMap(order =>
//           order.orderItem
//             .filter(orderItem => orderItem.productId !== item.productId)
//             .map(orderItem => orderItem.product)
//         ).reduce((acc, product) => {
//           acc[product.id] = (acc[product.id] || 0) + 1;
//           return acc;
//         }, {});

//         // Sort and take top 5 related products
//         const relatedProducts = Object.entries(productCounts)
//           .sort(([, a], [, b]) => b - a)
//           .slice(0, 5)
//           .map(([id]) => orders.flatMap(order => order.orderItems).find(orderItem => orderItem.product.id === id).product);

//         const mainProduct = await prisma.product.findUnique({
//           where: { id: item.productId },
//           include: {
//             categories: true,
//             shop: true,
//           },
//         });

//         return {
//           mainProduct,
//           relatedProducts,
//         };
//       })
//     );

//     return NextResponse.json(frequentlyBoughtTogether);
//   } catch (error) {
//     console.error('Error fetching frequently bought products:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }