import type { Metadata } from 'next';
import { SITE_NAME } from '@/config';

export const metadata: Metadata = {
    title: `Order History - ${SITE_NAME}`,
    description: 'Track your seafood orders and view order history.',
};

export default function OrdersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
