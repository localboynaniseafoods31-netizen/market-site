import { redirect } from 'next/navigation';
import { auth, signOut } from '@/lib/auth';
import Link from 'next/link';
import { Package, ShoppingBag, LayoutDashboard, Tags, LogOut, ChevronRight, TrendingUp, Calendar, Image, Megaphone, Sparkles } from 'lucide-react';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    if ((session.user as any).role !== 'ADMIN') {
        redirect('/');
    }

    const navItems = [
        { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', mobileLabel: 'Home' },
        { href: '/admin/sales', icon: TrendingUp, label: 'Sales', mobileLabel: 'Sales' },
        { href: '/admin/approvals', icon: Calendar, label: 'Approvals', mobileLabel: 'Approve' },
        { href: '/admin/orders', icon: ShoppingBag, label: 'Orders', mobileLabel: 'Orders' },
        { href: '/admin/products', icon: Package, label: 'Products', mobileLabel: 'Prods' },
        { href: '/admin/categories', icon: Tags, label: 'Categories', mobileLabel: 'Cats' },
        { href: '/admin/deals', icon: Sparkles, label: 'Crazy Deals', mobileLabel: 'Deals' },
        { href: '/admin/media', icon: Image, label: 'Media', mobileLabel: 'Media' },
        { href: '/admin/banners', icon: Megaphone, label: 'Banners', mobileLabel: 'Banners' },
    ];

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Admin Header */}
            <header className="sticky top-0 z-50 bg-background border-b border-border overflow-hidden">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="text-xl font-black text-primary truncate max-w-[150px] md:max-w-none">
                            Localboynaniseafoods Admin
                        </Link>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                        <span className="text-sm text-muted-foreground mr-2 hidden md:inline">
                            {(session.user as any).username}
                        </span>
                        <form
                            action={async () => {
                                'use server';
                                await signOut();
                            }}
                        >
                            <button className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 font-medium">
                                <LogOut size={16} /> <span className="hidden md:inline">Logout</span>
                            </button>
                        </form>
                        <div className="h-4 w-[1px] bg-border mx-1 md:mx-2"></div>
                        <Link
                            href="/"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                            <span className="hidden md:inline">View Store</span> <ChevronRight size={14} />
                        </Link>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-card border-r border-border min-h-[calc(100vh-64px)] p-4 hidden md:block">
                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Mobile Nav */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
                    <nav className="flex justify-around py-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex flex-col items-center gap-1 px-1 py-2 text-muted-foreground hover:text-primary min-w-[50px]"
                            >
                                <item.icon size={18} />
                                <span className="text-[10px]">{item.mobileLabel}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <main className="flex-1 p-6 pb-24 md:pb-6 overflow-x-hidden">{children}</main>
            </div>
        </div>
    );
}
