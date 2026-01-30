import type { Metadata } from 'next';
import { SITE_NAME, SITE_DESCRIPTION } from '@/config';

export const metadata: Metadata = {
    title: `Shop Seafood by Category - ${SITE_NAME}`,
    description: 'Browse our wide selection of fresh seafood. Marine fish, river fish, prawns, crabs, and ready-to-cook options.',
};

export default function CategoryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
