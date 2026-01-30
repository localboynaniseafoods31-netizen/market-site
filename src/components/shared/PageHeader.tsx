import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/config';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: BreadcrumbItem[];
    backHref?: string;
    backLabel?: string;
    actions?: React.ReactNode;
    className?: string;
}

export function PageHeader({
    title,
    description,
    breadcrumbs,
    backHref,
    backLabel = 'Back',
    actions,
    className,
}: PageHeaderProps) {
    return (
        <header className={cn('mb-6', className)}>
            {/* Back Link */}
            {backHref && (
                <Link
                    href={backHref}
                    className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    {backLabel}
                </Link>
            )}

            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumb className="mb-4">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href={ROUTES.HOME}>Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {breadcrumbs.map((crumb, index) => (
                            <BreadcrumbItem key={index}>
                                <BreadcrumbSeparator />
                                {crumb.href ? (
                                    <BreadcrumbLink asChild>
                                        <Link href={crumb.href}>{crumb.label}</Link>
                                    </BreadcrumbLink>
                                ) : (
                                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                )}
                            </BreadcrumbItem>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            )}

            {/* Title and Actions */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900">{title}</h1>
                    {description && (
                        <p className="mt-1 text-slate-500">{description}</p>
                    )}
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
        </header>
    );
}
