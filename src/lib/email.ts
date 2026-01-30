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
}

export const sendOrderConfirmation = async (order: OrderEmailProps, email: string) => {
    // Basic HTML Template for Invoice
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
                <h1>Ocean Fresh</h1>
                <p>Premium Seafood Delivery</p>
            </div>
            
            <p>Hi ${order.customerName},</p>
            <p>Thank you for your order! We've received it and are getting it fresh for you.</p>
            
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
                <p>If you have any questions, please contact us at support@oceanfresh.com</p>
                <p>&copy; ${new Date().getFullYear()} Ocean Fresh. All rights reserved.</p>
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
            from: '"Ocean Fresh" <orders@oceanfresh.com>',
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

        await transporter.sendMail({
            from: '"Ocean Fresh System" <system@oceanfresh.com>',
            to: process.env.ADMIN_EMAIL || 'admin@oceanfresh.com',
            subject: `New Order: ${order.orderNumber}`,
            html,
        });
    } catch (error) {
        console.error('❌ Failed to send admin notification:', error);
    }
};
