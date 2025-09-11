import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const totalCustomers = await prisma.customer.count();
    const totalOrders = await prisma.order.count();
    const totalRevenueResult = await prisma.order.aggregate({
      _sum: {
        totalPrice: true,
      },
    });
    
    const totalRevenue = totalRevenueResult._sum.totalPrice || 0;

    const summaryData = {
      totalCustomers,
      totalOrders,
      totalRevenue,
    };

    return NextResponse.json(summaryData);

  } catch (error) {
    console.error("Failed to fetch summary:", error);
    return new Response('Internal Server Error', { status: 500 });
  }
}