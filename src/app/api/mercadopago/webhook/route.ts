import { MercadoPagoConfig, Payment } from 'mercadopago';
import { NextResponse } from 'next/server';
import { insforge } from '@/lib/insforge';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // MercadoPago sends notifications in different formats depending on the topic.
        // We only care about explicit payment notifications usually containing type: 'payment' and action: 'payment.created'
        if (body.type === 'payment' && body.data && body.data.id) {
            const paymentId = body.data.id;

            const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
            const payment = new Payment(client);

            // Fetch the actual payment status securely from MP
            const paymentData = await payment.get({ id: paymentId });

            if (paymentData.status === 'approved') {
                const metadata = paymentData.metadata;

                if (metadata && metadata.user_id && metadata.plan_id) {
                    const userId = metadata.user_id;
                    const planId = metadata.plan_id;
                    const billingCycle = metadata.billing_cycle;

                    console.log(`Fulfilling MP Payment for User ${userId}, Plan ${planId}`);

                    // Calculate credits and expiration
                    let newCredits = 10;
                    if (planId === 'pro') newCredits = 500;
                    if (planId === 'enterprise') newCredits = 5000;

                    let expiryDate = new Date();
                    if (billingCycle === 'yearly') {
                        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
                    } else {
                        expiryDate.setMonth(expiryDate.getMonth() + 1);
                    }

                    // Update their profile to active, bump tier and set credits
                    await insforge.database
                        .from('profiles')
                        .update({
                            subscription_tier: planId,
                            subscription_status: 'active',
                            mia_credits: newCredits,
                            payment_provider: 'mercadopago',
                            provider_subscription_id: paymentId,
                            subscription_end_at: expiryDate.toISOString()
                        })
                        .eq('id', userId);

                    // Optional: You could write this into the 'transactions' table to track the revenue
                }
            }
        }

        // Always return 200 OK so MercadoPago knows we received the webhook
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Mercado Pago Webhook Error:", error);
        // It's still good practice to return 200 to not get retried indefinitely on a parsing error, 
        // unless you want MP to retry if your DB is down.
        return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
    }
}
