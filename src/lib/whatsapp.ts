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
 * Format order items for WhatsApp messages
 * Returns string like: "Fish (4kg), Prawns (2kg)"
 */
const formatOrderItems = (items: any[]) => {
    if (!items || items.length === 0) return 'Order Items';
    return items.map(item => {
        const product = item.product?.name || 'Item';
        const quantity = item.quantity;
        // Assuming quantity is just a number, we might need unit from product if available
        // But for now, just sending name and qty is safer or "Fish x 2"
        // User requested "Fish 4kg". If quantity is weight-based, we might need logic.
        // Assuming item.quantity is the count being ordered.
        return `${product} x ${quantity}`;
    }).join(', ');
};

/**
 * Send Order Confirmation to Customer (Placed)
 * Template ID: 26155
 * Variables: {{1}} Name, {{2}} Order Number, {{3}} Amount, {{4}} PDF Filename
 */
export const sendOrderConfirmationWhatsApp = async (order: any, invoiceUrl?: string) => {
    const templateId = '26155';
    const customerName = order.user?.name || order.deliveryName || 'Customer';
    const customerPhone = order.user?.phone || order.deliveryPhone;

    if (!customerPhone) return;

    const invoiceFileName = `${order.orderNumber}.pdf`;

    const bodyValues = {
        '1': customerName,
        '2': order.orderNumber,
        '3': `₹${(order.total / 100).toFixed(0)}`,
        '4': invoiceFileName
    };

    return sendAuthkeyWhatsApp(customerPhone, templateId, bodyValues);
};

// Admin alert reuse same confirmation or simpler template
export const sendAdminAlertWhatsApp = async (order: any, targetPhone?: string) => {
    const adminPhone = targetPhone || process.env.ADMIN_PHONE;
    if (!adminPhone) return;

    // Admin might want same details
    // If we use 26155 for admin too:
    const templateId = '26155';
    const customerName = order.user?.name || order.deliveryName || 'Customer';
    const invoiceFileName = `${order.orderNumber}.pdf`;

    const bodyValues = {
        '1': `Admin Alert: New Order from ${customerName}`,
        '2': order.orderNumber,
        '3': `₹${(order.total / 100).toFixed(0)}`,
        '4': invoiceFileName
    };

    return sendAuthkeyWhatsApp(adminPhone, templateId, bodyValues);
};

/**
 * Send Order Delivered WhatsApp
 * Template ID: 26156
 * Variables: {{1}} Name, {{2}} Order Details (e.g. Fish 4kg)
 */
export const sendOrderDeliveredWhatsApp = async (phone: string, name: string, orderItems: any[]) => {
    const templateId = '26156';
    const details = formatOrderItems(orderItems);
    return sendAuthkeyWhatsApp(phone, templateId, { '1': name, '2': details });
};

/**
 * Send Order Cancelled WhatsApp
 * Template ID: 26320
 * Variables: {{1}} Name, {{2}} Order Name/Details
 */
export const sendOrderCancelledWhatsApp = async (phone: string, name: string, orderItems: any[]) => {
    const templateId = '26320';
    const details = formatOrderItems(orderItems);
    return sendAuthkeyWhatsApp(phone, templateId, { '1': name, '2': details });
};

/**
 * Send Order Shipped WhatsApp
 * Template ID: 26323
 * Variables: {{1}} Name, {{2}} Order Details
 */
export const sendOrderShippedWhatsApp = async (phone: string, name: string, orderItems: any[]) => {
    const templateId = '26323';
    const details = formatOrderItems(orderItems);
    return sendAuthkeyWhatsApp(phone, templateId, { '1': name, '2': details });
};

/**
 * Router for Status Updates
 */
export const sendOrderStatusUpdateWhatsApp = async (
    phone: string,
    customerName: string,
    order: any,
    newStatus: string
) => {
    if (!phone) return;

    // Map status to specific functions
    if (newStatus === 'DELIVERED') {
        return sendOrderDeliveredWhatsApp(phone, customerName, order.items);
    }
    if (newStatus === 'CANCELLED') {
        return sendOrderCancelledWhatsApp(phone, customerName, order.items);
    }
    if (newStatus === 'SHIPPED') {
        return sendOrderShippedWhatsApp(phone, customerName, order.items);
    }

    // For other statuses (Processing, Confirmed manually), maybe no whatsapp or default?
    console.log(`No specific WhatsApp template for status: ${newStatus}`);
    return;
};
