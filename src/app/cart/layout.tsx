import type { Metadata } from 'next';
import { SITE_NAME } from '@/config';

export const metadata: Metadata = {
    title: `Your Cart - ${SITE_NAME}`,
    description: 'Review your seafood order before checkout. Fresh fish and prawns delivered to your doorstep.',
};

export default function CartLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
