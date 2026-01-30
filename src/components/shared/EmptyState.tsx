import Link from 'next/link';
import { LucideIcon, ShoppingBag, Package, Search, FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/config';

type EmptyStateVariant = 'cart' | 'orders' | 'search' | 'generic';

interface EmptyStateProps {
    variant?: EmptyStateVariant;
    title?: string;
    description?: string;
    icon?: LucideIcon;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
    className?: string;
}

const variantDefaults: Record<EmptyStateVariant, {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel: string;
    actionHref: string;
}> = {
    cart: {
        icon: ShoppingBag,
        title: 'Your cart is empty',
        description: 'Add some fresh seafood to get started',
        actionLabel: 'Start Shopping',
        actionHref: ROUTES.CATEGORY,
    },
    orders: {
        icon: Package,
        title: 'No orders yet',
        description: 'Once you place an order, it will appear here',
        actionLabel: 'Start Shopping',
        actionHref: ROUTES.CATEGORY,
    },
    search: {
        icon: Search,
        title: 'No results found',
        description: 'Try adjusting your search or filters',
        actionLabel: 'Clear Search',
        actionHref: ROUTES.CATEGORY,
    },
    generic: {
        icon: FileX,
        title: 'Nothing here',
        description: 'This section is empty',
        actionLabel: 'Go Home',
        actionHref: ROUTES.HOME,
    },
};

export function EmptyState({
    variant = 'generic',
    title,
    description,
    icon,
    actionLabel,
    actionHref,
    onAction,
    className,
}: EmptyStateProps) {
    const defaults = variantDefaults[variant];
    const Icon = icon || defaults.icon;
    const finalTitle = title || defaults.title;
    const finalDescription = description || defaults.description;
    const finalActionLabel = actionLabel || defaults.actionLabel;
    const finalActionHref = actionHref || defaults.actionHref;

    return (
        <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
            <div className="w-20 h-20 mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                <Icon className="w-8 h-8 text-slate-400" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">{finalTitle}</h3>
            <p className="text-slate-500 mb-8 max-w-sm">{finalDescription}</p>

            {onAction ? (
                <Button onClick={onAction} size="lg" className="rounded-full px-8">
                    {finalActionLabel}
                </Button>
            ) : (
                <Link href={finalActionHref}>
                    <Button size="lg" className="rounded-full px-8">
                        {finalActionLabel}
                    </Button>
                </Link>
            )}
        </div>
    );
}
