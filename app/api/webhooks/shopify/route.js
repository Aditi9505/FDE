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
    switch (topic) {
      case 'orders/create':
        // TODO: Add logic here to save the order data to your database
        console.log('Received a new order:', data);
        break;

      case 'customers/create':
        // TODO: Add logic here to save the customer data
        console.log('Received a new customer:', data);
        break;

      case 'products/create':
        // TODO: Add logic here to save the product data
        console.log('Received a new product:', data);
        break;
    }

    // Respond to Shopify with a 200 OK
    return new Response('Webhook received successfully', { status: 200 });
  } catch (error) {
    console.error('Failed to process webhook:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}