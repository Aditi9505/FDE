import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const topCustomers = await prisma.customer.findMany({
      orderBy: {
        totalSpent: 'desc',
      },
      take: 5,
    });

    return NextResponse.json(topCustomers);

  } catch (error) {
    console.error("Failed to fetch top customers:", error);
    return new Response('Internal Server Error', { status: 500 });
  }
}