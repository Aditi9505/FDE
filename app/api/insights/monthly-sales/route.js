import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const salesData = await prisma.$queryRaw`
      SELECT
        DATE_FORMAT(orderedAt, '%Y-%m') AS month,
        SUM(totalPrice) AS totalSales
      FROM \`Order\`
      GROUP BY month
      ORDER BY month ASC;
    `;

    // Format the output to ensure numbers are numbers
    const formattedSalesData = salesData.map(item => ({
      month: item.month,
      totalSales: parseFloat(item.totalSales) // Ensure it's a number
    }));

    return NextResponse.json(formattedSalesData);

  } catch (error) {
    console.error("Failed to fetch monthly sales:", error);
    return new Response('Internal Server Error', { status: 500 });
  }
}