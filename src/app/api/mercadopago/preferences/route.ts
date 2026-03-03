import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';
import { insforge } from '@/lib/insforge';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { planId, billingCycle } = body;

        // 1. Authenticate User
        const { data: sessionData } = await insforge.auth.getCurrentSession();
        if (!sessionData.session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = sessionData.session.user.id;

        // 2. Determine price and product from planId
        let price = 0;
        let title = '';

        if (billingCycle === 'yearly') {
            if (planId === 'pro') price = 48000;
            if (planId === 'enterprise') price = 144000;
        } else {
            if (planId === 'pro') price = 5000;
            if (planId === 'enterprise') price = 15000;
        }

        if (price === 0) {
            return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 });
        }

        if (planId === 'pro') title = `Finmom Pro (${billingCycle})`;
        if (planId === 'enterprise') title = `Finmom Enterprise (${billingCycle})`;

        // 3. Initialize Mercado Pago
        const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
        const preference = new Preference(client);

        // 4. Create Preference
        // Assuming your NEXT_PUBLIC_APP_URL is set in your .env
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        const result = await preference.create({
            body: {
                items: [
                    {
                        id: planId,
                        title: title,
                        quantity: 1,
                        unit_price: price,
                        currency_id: 'ARS',
                    }
                ],
                payer: {
                    email: sessionData.session.user.email,
                },
                back_urls: {
                    success: `${baseUrl}/pricing/success?plan=${planId}&cycle=${billingCycle}`,
                    failure: `${baseUrl}/pricing`,
                    pending: `${baseUrl}/pricing`,
                },
                auto_return: 'approved',
                // Important: Pass metadata so the webhook knows who paid for what
                metadata: {
                    user_id: userId,
                    plan_id: planId,
                    billing_cycle: billingCycle
                },
                // Add a webhook for async fulfillment
                notification_url: `${baseUrl}/api/mercadopago/webhook`
            }
        });

        return NextResponse.json({ id: result.id, init_point: result.init_point });
    } catch (error) {
        console.error("Mercado Pago Preference Error:", error);
        return NextResponse.json({ error: "Failed to create payment preference" }, { status: 500 });
    }
}
