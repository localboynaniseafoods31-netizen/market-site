import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
    variant: 'product-card' | 'product-grid' | 'cart-item' | 'order-item' | 'page';
    count?: number;
    className?: string;
}

export function LoadingSkeleton({ variant, count = 1, className }: LoadingSkeletonProps) {
    const items = Array.from({ length: count }, (_, i) => i);

    switch (variant) {
        case 'product-card':
            return (
                <>
                    {items.map((i) => (
                        <div
                            key={i}
                            className={cn('bg-white rounded-2xl border border-slate-200 p-0 overflow-hidden', className)}
                        >
                            <Skeleton className="w-full aspect-[4/3]" />
                            <div className="p-4 space-y-3">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-6 w-16" />
                                    <Skeleton className="h-6 w-20" />
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <Skeleton className="h-6 w-16" />
                                    <Skeleton className="h-8 w-20 rounded-lg" />
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            );

        case 'product-grid':
            return (
                <div className={cn('grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6', className)}>
                    <LoadingSkeleton variant="product-card" count={count} />
                </div>
            );

        case 'cart-item':
            return (
                <>
                    {items.map((i) => (
                        <div
                            key={i}
                            className={cn('flex gap-4 p-4 bg-white rounded-xl', className)}
                        >
                            <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <div className="flex justify-between">
                                    <Skeleton className="h-6 w-16" />
                                    <Skeleton className="h-8 w-24 rounded-lg" />
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            );

        case 'order-item':
            return (
                <>
                    {items.map((i) => (
                        <div
                            key={i}
                            className={cn('p-4 bg-white rounded-2xl border border-slate-100', className)}
                        >
                            <div className="flex justify-between mb-3">
                                <div className="space-y-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-5 w-32" />
                                </div>
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                            <Skeleton className="h-4 w-40 mb-3" />
                            <div className="flex justify-between pt-3 border-t border-slate-100">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-4" />
                            </div>
                        </div>
                    ))}
                </>
            );

        case 'page':
            return (
                <div className={cn('space-y-6 p-4', className)}>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                    <div className="space-y-4">
                        <Skeleton className="h-32 w-full rounded-xl" />
                        <Skeleton className="h-32 w-full rounded-xl" />
                    </div>
                </div>
            );

        default:
            return <Skeleton className={cn('h-20 w-full', className)} />;
    }
}
