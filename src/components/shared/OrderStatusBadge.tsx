import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/config';

interface OrderStatusBadgeProps {
    status: string;
    className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
    const label = ORDER_STATUS_LABELS[status] || status;
    const colorClass = ORDER_STATUS_COLORS[status] || 'bg-slate-100 text-slate-800';

    return (
        <Badge className={cn(colorClass, 'border-0 font-medium', className)}>
            {label}
        </Badge>
    );
}
