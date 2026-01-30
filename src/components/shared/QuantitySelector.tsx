'use client';

import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    useAppDispatch,
    useAppSelector,
    addToCart,
    incrementQuantity,
    decrementQuantity,
    selectProductQuantity,
} from '@/store';
import { toast } from 'sonner';

interface QuantitySelectorProps {
    productId: string;
    productName?: string;
    variant?: 'default' | 'compact' | 'card';
    showToast?: boolean;
    className?: string;
}

export function QuantitySelector({
    productId,
    productName = 'Item',
    variant = 'default',
    showToast = true,
    className,
}: QuantitySelectorProps) {
    const dispatch = useAppDispatch();
    const quantity = useAppSelector(selectProductQuantity(productId));

    const handleAdd = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();

        if (quantity === 0) {
            dispatch(addToCart({ productId, quantity: 1 }));
            if (showToast) {
                toast.success(`${productName} added to cart`);
            }
        } else {
            dispatch(incrementQuantity(productId));
        }
    };

    const handleRemove = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        dispatch(decrementQuantity(productId));
    };

    const baseStyles = {
        default: 'h-9 px-4',
        compact: 'h-8 px-3 text-sm',
        card: 'h-8 px-4',
    };

    if (quantity === 0) {
        return (
            <Button
                onClick={handleAdd}
                size="sm"
                className={cn(
                    'rounded-lg bg-slate-900 hover:bg-black text-white font-bold shadow-sm transition-all active:scale-95 border-none',
                    baseStyles[variant],
                    className
                )}
            >
                Add <Plus className="ml-1 w-3.5 h-3.5" />
            </Button>
        );
    }

    return (
        <div
            className={cn(
                'flex items-center bg-slate-900 text-white rounded-lg shadow-sm',
                variant === 'compact' ? 'h-8 px-0.5' : 'h-9 px-1',
                className
            )}
        >
            <button
                onClick={handleRemove}
                className="w-7 h-7 flex items-center justify-center rounded-sm hover:bg-white/10 transition-colors"
                aria-label="Decrease quantity"
            >
                <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-black min-w-[28px] text-center">{quantity}</span>
            <button
                onClick={handleAdd}
                className="w-7 h-7 flex items-center justify-center rounded-sm hover:bg-white/10 transition-colors"
                aria-label="Increase quantity"
            >
                <Plus className="w-4 h-4" />
            </button>
        </div>
    );
}
