import type { Metadata } from 'next';
import { SITE_NAME } from '@/config';
import ThankYouContent from './ThankYouContent';

export const metadata: Metadata = {
    title: `Thank You - ${SITE_NAME}`,
    description: `Thank you for choosing ${SITE_NAME}. We appreciate your trust and look forward to serving you again.`,
    robots: 'noindex, follow',
};

export default function ThankYouPage() {
    return <ThankYouContent />;
}
