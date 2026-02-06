import PDFDocument from 'pdfkit';

interface InvoiceItem {
    name: string;
    quantity: number;
    weight?: string;
    price: number; // In paisa
}

interface InvoiceData {
    orderNumber: string;
    orderDate: Date;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    deliveryAddress: string;
    deliveryCity: string;
    deliveryPincode: string;
    items: InvoiceItem[];
    subtotal: number;    // In paisa
    deliveryFee: number; // In paisa
    total: number;       // In paisa
    paymentStatus: string;
    paymentId?: string;
}

/**
 * Generate a PDF invoice and return as Buffer
 */
export const generateInvoicePDF = async (data: InvoiceData): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            margin: 50,
            size: 'A4'
        });

        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Colors
        const primaryColor = '#0ea5e9';
        const textColor = '#1e293b';
        const mutedColor = '#64748b';

        // ===== HEADER =====
        doc.fillColor(primaryColor)
            .fontSize(28)
            .font('Helvetica-Bold')
            .text('Ocean Fresh', 50, 50);

        doc.fillColor(mutedColor)
            .fontSize(10)
            .font('Helvetica')
            .text('Premium Seafood Delivery', 50, 82);

        // Invoice title (right side)
        doc.fillColor(textColor)
            .fontSize(24)
            .font('Helvetica-Bold')
            .text('INVOICE', 400, 50, { align: 'right' });

        doc.fillColor(mutedColor)
            .fontSize(10)
            .font('Helvetica')
            .text(`Order #${data.orderNumber}`, 400, 80, { align: 'right' })
            .text(`Date: ${formatDate(data.orderDate)}`, 400, 95, { align: 'right' });

        // Payment badge
        const badgeColor = data.paymentStatus === 'PAID' ? '#22c55e' : '#eab308';
        doc.fillColor(badgeColor)
            .roundedRect(450, 115, 70, 20, 3)
            .fill();
        doc.fillColor('#ffffff')
            .fontSize(8)
            .font('Helvetica-Bold')
            .text(data.paymentStatus || 'PENDING', 455, 120, { width: 60, align: 'center' });

        // ===== BILL TO =====
        doc.fillColor(mutedColor)
            .fontSize(9)
            .font('Helvetica-Bold')
            .text('BILL TO', 50, 160);

        doc.fillColor(textColor)
            .fontSize(12)
            .font('Helvetica-Bold')
            .text(data.customerName, 50, 175);

        doc.fontSize(10)
            .font('Helvetica')
            .fillColor(mutedColor)
            .text(data.deliveryAddress, 50, 192)
            .text(`${data.deliveryCity} - ${data.deliveryPincode}`, 50, 207)
            .text(`📞 ${data.customerPhone}`, 50, 227);

        if (data.customerEmail) {
            doc.text(`✉️ ${data.customerEmail}`, 50, 242);
        }

        // ===== ITEMS TABLE =====
        const tableTop = 280;
        const tableHeaders = ['Item', 'Qty', 'Price', 'Total'];
        const colWidths = [250, 60, 90, 90];
        let colX = 50;

        // Header row background
        doc.fillColor('#f1f5f9')
            .rect(50, tableTop - 5, 495, 25)
            .fill();

        // Header text
        doc.fillColor(mutedColor)
            .fontSize(9)
            .font('Helvetica-Bold');

        tableHeaders.forEach((header, i) => {
            const align = i === 0 ? 'left' : 'right';
            doc.text(header, colX, tableTop, { width: colWidths[i], align });
            colX += colWidths[i];
        });

        // Items
        let y = tableTop + 30;
        data.items.forEach((item) => {
            const lineTotal = (item.price * item.quantity) / 100;
            colX = 50;

            doc.fillColor(textColor)
                .fontSize(10)
                .font('Helvetica-Bold')
                .text(item.name, colX, y, { width: colWidths[0] });

            if (item.weight) {
                doc.fillColor(mutedColor)
                    .fontSize(8)
                    .font('Helvetica')
                    .text(item.weight, colX, y + 12);
            }

            doc.fillColor(textColor)
                .fontSize(10)
                .font('Helvetica')
                .text(String(item.quantity), colX + colWidths[0], y, { width: colWidths[1], align: 'right' })
                .text(`₹${(item.price / 100).toFixed(2)}`, colX + colWidths[0] + colWidths[1], y, { width: colWidths[2], align: 'right' })
                .text(`₹${lineTotal.toFixed(2)}`, colX + colWidths[0] + colWidths[1] + colWidths[2], y, { width: colWidths[3], align: 'right' });

            y += item.weight ? 35 : 25;

            // Row separator
            doc.strokeColor('#e2e8f0')
                .moveTo(50, y - 5)
                .lineTo(545, y - 5)
                .stroke();
        });

        // ===== TOTALS =====
        const totalsX = 350;
        y += 20;

        doc.fillColor(mutedColor)
            .fontSize(10)
            .font('Helvetica')
            .text('Subtotal', totalsX, y)
            .text(`₹${(data.subtotal / 100).toFixed(2)}`, totalsX + 100, y, { width: 95, align: 'right' });

        y += 20;
        doc.text('Delivery Fee', totalsX, y)
            .text(data.deliveryFee === 0 ? 'Free' : `₹${(data.deliveryFee / 100).toFixed(2)}`, totalsX + 100, y, { width: 95, align: 'right' });

        y += 25;
        doc.strokeColor('#e2e8f0')
            .moveTo(totalsX, y - 5)
            .lineTo(545, y - 5)
            .stroke();

        doc.fillColor(primaryColor)
            .fontSize(14)
            .font('Helvetica-Bold')
            .text('Total', totalsX, y)
            .text(`₹${(data.total / 100).toFixed(2)}`, totalsX + 100, y, { width: 95, align: 'right' });

        // ===== FOOTER =====
        const footerY = 750;
        doc.fillColor(mutedColor)
            .fontSize(9)
            .font('Helvetica')
            .text('Thank you for choosing Ocean Fresh!', 50, footerY, { align: 'center', width: 495 })
            .text('For support, contact us at support@oceanfresh.com or +91 99999 88888', 50, footerY + 15, { align: 'center', width: 495 });

        if (data.paymentId) {
            doc.fontSize(8)
                .text(`Payment ID: ${data.paymentId}`, 50, footerY + 35, { align: 'center', width: 495 });
        }

        doc.end();
    });
};

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}
