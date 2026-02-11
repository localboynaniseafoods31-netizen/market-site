import nodemailer from 'nodemailer';

// Email Configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER || 'test',
        pass: process.env.SMTP_PASS || 'test'
    },
});

interface OrderEmailProps {
    orderNumber: string;
    customerName: string;
    customerEmail?: string;
    items: {
        name: string;
        quantity: number;
        price: number;
    }[];
    total: number;
    deliveryFee: number;
    subtotal: number;
    date: Date;
    invoiceUrl?: string;
}

export const sendOrderConfirmation = async (order: OrderEmailProps, email: string) => {
    // Basic HTML Template for Invoice
    const invoiceButton = order.invoiceUrl
        ? `<div style="text-align: center; margin: 20px 0;">
               <a href="${order.invoiceUrl}" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">📄 Download Invoice</a>
           </div>`
        : '';

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; }
            .header { text-align: center; border-bottom: 2px solid #0ea5e9; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { color: #0ea5e9; margin: 0; }
            .order-details { margin-bottom: 20px; background: #f8fafc; padding: 15px; border-radius: 6px; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .table th { text-align: left; padding: 10px; background: #f1f5f9; border-bottom: 1px solid #e2e8f0; }
            .table td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
            .total { text-align: right; font-size: 1.2em; font-weight: bold; color: #0f172a; }
            .footer { text-align: center; font-size: 0.8em; color: #64748b; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Localboynaniseafoods</h1>
                <p>Premium Seafood Delivery</p>
            </div>
            
            <p>Hi ${order.customerName},</p>
            <p>Thank you for your order! We've received it and are getting it fresh for you.</p>
            
            ${invoiceButton}
            
            <div class="order-details">
                <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                <p><strong>Date:</strong> ${order.date.toLocaleDateString()}</p>
            </div>

            <table class="table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>₹${item.price.toFixed(2)}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="total">
                <p>Subtotal: ₹${order.subtotal.toFixed(2)}</p>
                <p>Delivery: ₹${order.deliveryFee.toFixed(2)}</p>
                <p style="color: #0ea5e9;">Total: ₹${order.total.toFixed(2)}</p>
            </div>

            <div class="footer">
                <p>If you have any questions, please contact us at hello@localboynaniseafoods.com</p>
                <p>&copy; ${new Date().getFullYear()} Localboynaniseafoods. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        if (!process.env.SMTP_HOST) {
            console.log('---------------------------------------------------');
            console.log('📧 MOCK EMAIL SENT TO:', email);
            console.log('Subject: Order Confirmation -', order.orderNumber);
            console.log('---------------------------------------------------');
            return;
        }

        await transporter.sendMail({
            from: '"Localboynaniseafoods" <orders@localboynaniseafoods.com>',
            to: email,
            subject: `Order Confirmation - ${order.orderNumber}`,
            html,
        });
        console.log(`✅ Email sent to ${email}`);
    } catch (error) {
        console.error('❌ Failed to send email:', error);
    }
};

export const sendAdminNotification = async (order: OrderEmailProps) => {
    // Simplified Admin Notification
    const html = `
        <h2>New Order Received: ${order.orderNumber}</h2>
        <p><strong>Customer:</strong> ${order.customerName} (${order.customerEmail || 'No Email'})</p>
        <p><strong>Total:</strong> ₹${order.total.toFixed(2)}</p>
        <hr/>
        <h3>Items needed:</h3>
        <ul>
            ${order.items.map(item => `<li>${item.quantity} x ${item.name}</li>`).join('')}
        </ul>
        <br/>
        <p><strong>Invoice:</strong> <a href="${order.invoiceUrl || '#'}">Download PDF</a></p>
        <br/>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/orders">View in Admin Dashboard</a>
    `;

    try {
        if (!process.env.SMTP_HOST) {
            console.log('---------------------------------------------------');
            console.log('📧 MOCK ADMIN NOTIFICATION');
            console.log('Subject: New Order:', order.orderNumber);
            console.log('---------------------------------------------------');
            return;
        }

        const adminEmails = (process.env.ADMIN_EMAIL || 'admin@localboynaniseafoods.com')
            .split(',')
            .map(e => e.trim())
            .filter(e => e.length > 0);

        console.log(`📧 Sending Admin Notifications to: ${adminEmails.join(', ')}`);

        // Send to all admins in parallel
        await Promise.all(adminEmails.map(email =>
            transporter.sendMail({
                from: '"Localboynaniseafoods System" <system@localboynaniseafoods.com>',
                to: email,
                subject: `New Order: ${order.orderNumber}`,
                html,
            }).catch(e => console.error(`❌ Failed to send to admin ${email}:`, e))
        ));

    } catch (error) {
        console.error('❌ Failed to send admin notification:', error);
    }
};

/**
 * Human-friendly status labels and messages
 */
const STATUS_INFO: Record<string, { label: string; emoji: string; message: string; color: string }> = {
    PENDING: { label: 'Pending', emoji: '⏳', message: 'Your order is being reviewed.', color: '#f59e0b' },
    CONFIRMED: { label: 'Confirmed', emoji: '✅', message: 'Your order has been confirmed and will be prepared soon!', color: '#22c55e' },
    PROCESSING: { label: 'Processing', emoji: '🔧', message: 'Your order is being prepared with the freshest catch!', color: '#3b82f6' },
    SHIPPED: { label: 'Shipped', emoji: '🚚', message: 'Your order is on the way! It will arrive soon.', color: '#8b5cf6' },
    DELIVERED: { label: 'Delivered', emoji: '🎉', message: 'Your order has been delivered! Enjoy your fresh seafood.', color: '#10b981' },
    CANCELLED: { label: 'Cancelled', emoji: '❌', message: 'Your order has been cancelled. If you have questions, please contact us.', color: '#ef4444' },
};

/**
 * Send Order Status Update Email to Customer
 */
export const sendOrderStatusUpdateEmail = async (
    email: string,
    customerName: string,
    orderNumber: string,
    oldStatus: string,
    newStatus: string,
) => {
    const info = STATUS_INFO[newStatus] || { label: newStatus, emoji: '📦', message: 'Your order status has been updated.', color: '#0ea5e9' };

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #0ea5e9; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { color: #0ea5e9; margin: 0; font-size: 22px; }
            .status-card { background: #f8fafc; border-radius: 12px; padding: 24px; text-align: center; margin: 20px 0; border-left: 4px solid ${info.color}; }
            .status-emoji { font-size: 48px; margin-bottom: 12px; }
            .status-label { font-size: 24px; font-weight: bold; color: ${info.color}; margin-bottom: 8px; }
            .status-message { font-size: 16px; color: #475569; }
            .order-info { background: #f1f5f9; padding: 16px; border-radius: 8px; margin: 16px 0; }
            .order-info p { margin: 4px 0; }
            .track-btn { display: inline-block; background: #0ea5e9; color: white; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 16px 0; }
            .footer { text-align: center; font-size: 12px; color: #94a3b8; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Localboynaniseafoods</h1>
                <p style="color: #64748b; margin: 4px 0;">Premium Seafood Delivery</p>
            </div>

            <p>Hi ${customerName},</p>

            <div class="status-card">
                <div class="status-emoji">${info.emoji}</div>
                <div class="status-label">Order ${info.label}</div>
                <div class="status-message">${info.message}</div>
            </div>

            <div class="order-info">
                <p><strong>Order Number:</strong> ${orderNumber}</p>
                <p><strong>Previous Status:</strong> ${STATUS_INFO[oldStatus]?.label || oldStatus}</p>
                <p><strong>New Status:</strong> ${info.label}</p>
            </div>

            <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://market-site-eta.vercel.app'}/orders" class="track-btn">
                    Track Your Order
                </a>
            </div>

            <div class="footer">
                <p>If you have any questions, contact us at hello@localboynaniseafoods.com</p>
                <p>&copy; ${new Date().getFullYear()} Localboynaniseafoods. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        if (!process.env.SMTP_HOST) {
            console.log('---------------------------------------------------');
            console.log(`📧 MOCK STATUS UPDATE EMAIL TO: ${email}`);
            console.log(`Subject: Order ${orderNumber} - ${info.label}`);
            console.log('---------------------------------------------------');
            return;
        }

        await transporter.sendMail({
            from: '"Localboynaniseafoods" <orders@localboynaniseafoods.com>',
            to: email,
            subject: `${info.emoji} Order ${orderNumber} - ${info.label}`,
            html,
        });
        console.log(`✅ Status update email sent to ${email}`);
    } catch (error) {
        console.error('❌ Failed to send status update email:', error);
    }
};
