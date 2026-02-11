/**
 * WhatsApp Integration using Authkey.io API
 * Docs: https://console.authkey.io
 */

const AUTHKEY_API_URL = 'https://console.authkey.io/restapi/requestjson.php';

interface AuthkeyPayload {
    country_code: string;
    mobile: string;
    wid: string;
    type: 'text';
    bodyValues: Record<string, string>;
}

/**
 * Core function to send WhatsApp message via Authkey
 */
export const sendAuthkeyWhatsApp = async (
    mobile: string,
    templateId: string,
    bodyValues: Record<string, string>
) => {
    const token = process.env.AUTHKEY_TOKEN;
    const countryCode = process.env.AUTHKEY_COUNTRY_CODE || '91';
    const mode = process.env.WHATSAPP_MODE || 'dev';

    // Format phone: remove non-digits and strip country code if present
    let formattedPhone = mobile.replace(/\D/g, '');
    if (formattedPhone.startsWith('91') && formattedPhone.length > 10) {
        formattedPhone = formattedPhone.slice(2); // Remove 91 prefix
    }
    if (formattedPhone.startsWith('+')) {
        formattedPhone = formattedPhone.slice(1);
    }

    const payload: AuthkeyPayload = {
        country_code: countryCode,
        mobile: formattedPhone,
        wid: templateId,
        type: 'text',
        bodyValues
    };

    // DEV MODE: Just log the payload
    if (mode === 'dev') {
        console.log('📲 WhatsApp Payload (dev mode):');
        console.log(JSON.stringify(payload, null, 2));
        return { success: true, mode: 'dev', payload };
    }

    // PROD MODE: Actually send to Authkey
    if (!token) {
        console.error('❌ AUTHKEY_TOKEN not configured');
        return { success: false, error: 'Missing AUTHKEY_TOKEN' };
    }

    try {
        const res = await fetch(AUTHKEY_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok) {
            console.error('❌ Authkey API Error:', JSON.stringify(data, null, 2));
            return { success: false, error: data };
        }

        console.log('✅ WhatsApp Sent via Authkey:', data);
        return { success: true, data };

    } catch (error) {
        console.error('❌ WhatsApp Send Failed:', error);
        return { success: false, error: String(error) };
    }
};

/**
 * Send Order Confirmation to Customer
 * Template variables:
 *   {{1}} = Customer Name
 *   {{2}} = Order Number
 *   {{3}} = Amount (₹X)
 *   {{4}} = Invoice filename (for CTA button URL)
 */
export const sendOrderConfirmationWhatsApp = async (order: any, invoiceUrl?: string) => {
    const templateId = process.env.AUTHKEY_TEMPLATE_ID || '101';
    const invoiceBaseUrl = process.env.INVOICE_R2_BASE_URL || '';

    // Extract just the filename from the full URL if needed
    const customerName = order.user?.name || order.deliveryName || 'Customer';
    const customerPhone = order.user?.phone || order.deliveryPhone;

    if (!customerPhone) {
        console.error('❌ No customer phone for WhatsApp');
        return;
    }

    // Invoice filename for CTA button (e.g., "ORD-123456.pdf")
    const invoiceFileName = `${order.orderNumber}.pdf`;

    const bodyValues: Record<string, string> = {
        '1': customerName,
        '2': order.orderNumber,
        '3': `₹${(order.total / 100).toFixed(0)}`,
        '4': invoiceFileName
    };

    return sendAuthkeyWhatsApp(customerPhone, templateId, bodyValues);
};

/**
 * Send Admin Alert for New Order
 * Uses same or different template based on your Authkey setup
 */
export const sendAdminAlertWhatsApp = async (order: any) => {
    const adminPhone = process.env.ADMIN_PHONE;
    if (!adminPhone) {
        console.log('⚠️ No ADMIN_PHONE configured, skipping admin alert');
        return;
    }

    // Use same template or a different one for admin
    const templateId = process.env.AUTHKEY_ADMIN_TEMPLATE_ID || process.env.AUTHKEY_TEMPLATE_ID || '101';

    const customerName = order.user?.name || order.deliveryName || 'Customer';

    const bodyValues: Record<string, string> = {
        '1': customerName,
        '2': order.orderNumber,
        '3': `₹${(order.total / 100).toFixed(0)}`,
        '4': `${order.orderNumber}.pdf`
    };

    return sendAuthkeyWhatsApp(adminPhone, templateId, bodyValues);
};

/**
 * Send Order Status Update WhatsApp
 * Requires a template with 3 variables:
 * {{1}} = Customer Name
 * {{2}} = Order Number
 * {{3}} = New Status (e.g. "Shipped", "Delivered")
 */
export const sendOrderStatusUpdateWhatsApp = async (
    phone: string,
    customerName: string,
    orderNumber: string,
    newStatus: string
) => {
    if (!phone) return;

    // Use a specific template for status updates, or fallback to default
    const templateId = process.env.AUTHKEY_STATUS_TEMPLATE_ID || '102';

    const bodyValues: Record<string, string> = {
        '1': customerName,
        '2': orderNumber,
        '3': newStatus
    };

    return sendAuthkeyWhatsApp(phone, templateId, bodyValues);
};
