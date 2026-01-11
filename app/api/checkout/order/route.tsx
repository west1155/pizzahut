import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { OrderTemplate } from '@/components/shared/email-templates/order-template';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { firstName, lastName, email, phone, address, comment, items, totalAmount } = body;

        if (!email || !items || !totalAmount) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // In a real app, you would create an order in the database here
        const orderId = Math.floor(Math.random() * 100000);

        if (!process.env.RESEND_API_KEY) {
            console.error('[ORDER_EMAIL_ERROR] RESEND_API_KEY is not defined');
        }

        try {
            const { data, error } = await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: 'westsupport@gmail.com',
                subject: `New Order PizzaHut #${orderId}`,
                react: <OrderTemplate
                    orderId={orderId}
                    totalAmount={totalAmount}
                    items={items}
                />,
            });

            if (error) {
                console.error('[ORDER_EMAIL_ERROR] Resend API Error:', error);
                throw error;
            }

            console.log('[ORDER_EMAIL_SUCCESS] Email sent:', data);
        } catch (emailError) {
            console.error('[ORDER_EMAIL_ERROR] Catch block:', emailError);
        }

        // Send Telegram notification
        const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
        const telegramChatId = process.env.TELEGRAM_CHAT_ID;

        if (telegramToken && telegramChatId) {
            try {
                const message = `
<b>🔔 New Order #${orderId}</b>

<b>👤 Customer:</b> ${firstName} ${lastName}
<b>📧 Email:</b> ${email}
<b>📞 Phone:</b> ${phone}
<b>🏠 Address:</b> ${address}
${comment ? `<b>💬 Comment:</b> ${comment}` : ''}

<b>🍕 Items:</b>
${items.map((item: any) => `- ${item.productItem.product.name} (${item.quantity}x)`).join('\n')}

<b>💰 Total Amount:</b> ${totalAmount} £
                `;

                await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: telegramChatId,
                        text: message,
                        parse_mode: 'HTML',
                    }),
                });
            } catch (telegramError) {
                console.error('[ORDER_TELEGRAM_ERROR]', telegramError);
            }
        }

        return NextResponse.json({ success: true, orderId });
    } catch (error) {
        console.error('[ORDER_POST] Server error', error);
        return NextResponse.json({ message: 'Failed to place order' }, { status: 500 });
    }
}
