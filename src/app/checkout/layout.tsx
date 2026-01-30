import type { Metadata } from 'next';
import { SITE_NAME } from '@/config';

export const metadata: Metadata = {
    title: `Checkout - ${SITE_NAME}`,
    description: 'Complete your seafood order. Secure checkout with multiple payment options.',
};

export default function CheckoutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
