import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// In the App Router, you export a function for each HTTP method (e.g., POST, GET)
export async function POST(req) {
  // Get the headers from the request
  const topic = req.headers.get('x-shopify-topic');
  const shopDomain = req.headers.get('x-shopify-shop-domain');
  
  // Get the body of the request
  const data = await req.json();

  console.log(`Webhook received for topic: ${topic} from ${shopDomain}`);

  try {
    // Find the store in your database to get its ID
    const store = await prisma.store.findUnique({
      where: { shopName: shopDomain },
    });

    if (!store) {
      console.log(`Store not found for domain: ${shopDomain}`);
      return new Response('Store not found', { status: 404 });
    }

    // Use a switch statement to handle different types of webhooks
    // Use a switch statement to handle different types of webhooks
switch (topic) {
  case 'orders/create':
    // Logic to save a new order
    // Note: This assumes the customer already exists in your DB.
    // Shopify typically sends the customer/create webhook first.
    await prisma.order.create({
      data: {
        id: `shopify-${data.id}`,
        orderNumber: data.order_number,
        totalPrice: parseFloat(data.total_price),
        orderedAt: new Date(data.created_at),
        storeId: store.id,
        customerId: `shopify-${data.customer.id}`,
      },
    });
    console.log(`Saved new order ${data.order_number} for ${shopDomain}`);
    break;

  case 'customers/create':
    // Logic to save a new customer
    await prisma.customer.create({
      data: {
        id: `shopify-${data.id}`,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        totalSpent: parseFloat(data.total_spent),
        storeId: store.id,
      },
    });
    console.log(`Saved new customer ${data.email} for ${shopDomain}`);
    break;

  case 'products/create':
    // Logic to save a new product
    await prisma.product.create({
      data: {
        id: `shopify-${data.id}`,
        title: data.title,
        vendor: data.vendor,
        price: parseFloat(data.variants[0]?.price || 0),
        storeId: store.id,
      },
    });
    console.log(`Saved new product "${data.title}" for ${shopDomain}`);
    break;
}

    // Respond to Shopify with a 200 OK
    return new Response('Webhook received successfully', { status: 200 });
  } catch (error) {
    console.error('Failed to process webhook:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}