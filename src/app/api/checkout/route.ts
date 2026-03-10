import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
  // Vercel inadi kiriliyor
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("API Received body:", body);
    
    const { id, title, price } = body;

    if (!id || !title || !price) {
      return NextResponse.json({ 
        error: `Missing required fields. Received: ${JSON.stringify(body)}` 
      }, { status: 400 });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: title,
              description: `Digital asset: ${title}`,
            },
            unit_amount: Math.round(parseFloat(price) * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/explore?success=true`,
      cancel_url: `${request.nextUrl.origin}/explore?canceled=true`,
      metadata: {
        productId: id.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
