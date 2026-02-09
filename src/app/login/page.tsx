'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Fish, Lock, User } from 'lucide-react';
import Image from 'next/image';

import { Suspense } from 'react';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            toast.error('Please enter both username and password');
            return;
        }

        setLoading(true);

        try {
            const result = await signIn('credentials', {
                username: formData.username,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                toast.error('Invalid credentials');
                setLoading(false);
            } else {
                toast.success('Logged in successfully');

                // Get updated session to check role
                const session = await getSession();
                const role = session?.user?.role;

                router.refresh();

                if (role === 'ADMIN' || role === 'EDITOR') {
                    router.push('/admin');
                } else {
                    router.push(callbackUrl);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <Fish className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        Localboynaniseafoods Login
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Enter your credentials to access the portal
                    </p>
                </div>

                <Card className="p-6 shadow-lg border-primary/10">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    placeholder="Enter username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="password"
                                    className="pl-9"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>



                    </form>
                </Card>

                <p className="text-center text-xs text-muted-foreground mt-8">
                    &copy; 2024 Localboynaniseafoods. All rights reserved.
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <LoginForm />
        </Suspense>
    );
}
