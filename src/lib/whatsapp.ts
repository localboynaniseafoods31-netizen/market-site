const WHATSAPP_API_URL = 'https://graph.facebook.com/v17.0'; // Or latest version

interface WhatsAppMessage {
    messaging_product: 'whatsapp';
    to: string;
    type: 'template';
    template: {
        name: string;
        language: {
            code: string;
        };
        components?: any[];
    };
}

export const sendWhatsAppMessage = async (to: string, templateName: string, components: any[] = []) => {
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!token || !phoneId) {
        console.log('⚠️ WhatsApp Credentials missing. Logging message instead.');
        console.log('To:', to);
        console.log('Template:', templateName);
        console.log('Data:', JSON.stringify(components, null, 2));
        return;
    }

    // Format phone number: Remove non-digits, ensure 91 prefix
    let formattedPhone = to.replace(/\D/g, '');
    if (!formattedPhone.startsWith('91') && formattedPhone.length === 10) {
        formattedPhone = '91' + formattedPhone;
    }

    const payload: WhatsAppMessage = {
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'template',
        template: {
            name: templateName,
            language: { code: 'en_US' }, // Or 'en' depending on your template setup
            components
        }
    };

    try {
        const res = await fetch(`${WHATSAPP_API_URL}/${phoneId}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok) {
            console.error('❌ WhatsApp API Error:', JSON.stringify(data, null, 2));
            throw new Error(data.error?.message || 'WhatsApp API failed');
        }

        console.log('✅ WhatsApp Sent:', data.messages?.[0]?.id);
        return data;

    } catch (error) {
        console.error('❌ WhatsApp Send Failed:', error);
        // Don't throw to avoid breaking the order flow, just log
    }
};

export const sendOrderConfirmationWhatsApp = async (order: any, invoiceUrl?: string) => {
    // Template: order_confirmation
    // Variables: {{1}} = Order Number, {{2}} = Total Amount, {{3}} = Invoice Link

    // Use provided URL or fallback to dynamic page
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://oceanfresh.com';
    const invoiceLink = invoiceUrl || `${appUrl}/orders/${order.id}/invoice`;

    const components = [
        {
            type: 'body',
            parameters: [
                { type: 'text', text: order.orderNumber },
                { type: 'text', text: `₹${(order.total / 100).toFixed(2)}` },
                { type: 'text', text: invoiceLink }
            ]
        }
    ];

    await sendWhatsAppMessage(order.user?.phone || order.deliveryPhone, 'order_confirmation', components);
};

export const sendAdminAlertWhatsApp = async (order: any) => {
    // Template: admin_new_order
    // Variables: {{1}} = Order #, {{2}} = Amount, {{3}} = Customer Name

    const adminPhone = process.env.ADMIN_PHONE; // Admin's WhatsApp number
    if (!adminPhone) return;

    const components = [
        {
            type: 'body',
            parameters: [
                { type: 'text', text: order.orderNumber },
                { type: 'text', text: `₹${(order.total / 100).toFixed(2)}` },
                { type: 'text', text: order.user?.name || order.deliveryName || 'Customer' }
            ]
        }
    ];

    await sendWhatsAppMessage(adminPhone, 'admin_new_order', components);
};
