import { cn } from '@/lib/utils';

interface PriceDisplayProps {
    price: number;
    originalPrice?: number;
    offerPercentage?: number;
    size?: 'sm' | 'md' | 'lg';
    showSavings?: boolean;
    className?: string;
}

export function PriceDisplay({
    price,
    originalPrice,
    offerPercentage,
    size = 'md',
    showSavings = false,
    className,
}: PriceDisplayProps) {
    const savings = originalPrice ? originalPrice - price : 0;

    const sizeStyles = {
        sm: {
            price: 'text-sm font-bold',
            original: 'text-[10px]',
            offer: 'text-[10px]',
        },
        md: {
            price: 'text-base font-bold',
            original: 'text-xs',
            offer: 'text-[11px]',
        },
        lg: {
            price: 'text-xl font-black',
            original: 'text-sm',
            offer: 'text-xs',
        },
    };

    return (
        <div className={cn('flex flex-col gap-0.5', className)}>
            <div className="flex items-baseline gap-2">
                <span className={cn(sizeStyles[size].price, 'text-slate-900')}>
                    ₹{price}
                </span>
                {originalPrice && originalPrice > price && (
                    <span className={cn(sizeStyles[size].original, 'text-slate-400 line-through')}>
                        ₹{originalPrice}
                    </span>
                )}
            </div>

            {offerPercentage && offerPercentage > 0 && (
                <span className={cn(sizeStyles[size].offer, 'font-bold text-[var(--offer-text)]')}>
                    {offerPercentage}% off
                </span>
            )}

            {showSavings && savings > 0 && (
                <span className={cn(sizeStyles[size].offer, 'font-medium text-[var(--success)]')}>
                    You save ₹{savings}
                </span>
            )}
        </div>
    );
}
