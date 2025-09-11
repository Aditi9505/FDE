import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  const topic = req.headers.get('x-shopify-topic');
  const shopDomain = req.headers.get('x-shopify-shop-domain');
  const data = await req.json();

  console.log(`Webhook received for topic: ${topic} from ${shopDomain}`);

  try {
    const store = await prisma.store.findUnique({
      where: { shopName: shopDomain },
    });

    if (!store) {
      console.log(`Store not found for domain: ${shopDomain}`);
      return new Response('Store not found', { status: 404 });
    }

    switch (topic) {
      case 'orders/create':
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

    return new Response('Webhook received successfully', { status: 200 });
  } catch (error) {
    console.error('Failed to process webhook:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}