import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import Link from 'next/link';
import { Package, LayoutDashboard, LogOut, Calendar } from 'lucide-react';

export default async function EditorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Check if user is logged in
    if (!session?.user) {
        redirect('/login');
    }

    // Check if user is authorized (Admin or Editor)
    const role = (session.user as any).role;
    if (role !== 'EDITOR' && role !== 'ADMIN') {
        redirect('/');
    }

    const navItems = [
        { href: '/editor', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/editor/sales', icon: Calendar, label: 'Daily Sales' },
    ];

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Editor Header */}
            <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-xl text-primary">Ocean Fresh Editor</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground hidden sm:inline-block">
                        {session.user.name || session.user.email} ({role})
                    </span>
                    <Link
                        href="/api/auth/signout"
                        className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                        <LogOut size={16} />
                        Logout
                    </Link>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r min-h-[calc(100vh-65px)] hidden md:block">
                    <nav className="p-4 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                            >
                                <item.icon size={18} />
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
