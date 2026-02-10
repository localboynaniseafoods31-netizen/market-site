import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    providers: [
        Credentials({
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                console.log('Login attempt for:', credentials?.username);
                try {
                    const username = (credentials?.username as string)?.toLowerCase();
                    const password = credentials?.password as string;

                    if (!username || !password) {
                        console.log('Auth failed: Missing credentials');
                        return null;
                    }

                    // Find user
                    const user = await prisma.user.findUnique({
                        where: { username },
                    });

                    if (!user) {
                        console.log('Auth failed: User not found in DB:', username);
                        return null;
                    }

                    if (!user.password) {
                        console.log('Auth failed: User has no password set');
                        return null;
                    }

                    // Verify password
                    const isValid = await bcrypt.compare(password, user.password);
                    console.log('Password verification for', username, ':', isValid);

                    if (!isValid) {
                        return null;
                    }

                    console.log('Auth successful for:', username);
                    return {
                        id: user.id,
                        name: user.name || user.username || '',
                        email: user.email || '',
                        username: user.username || undefined,
                        phone: user.phone || undefined,
                        role: user.role,
                    };
                } catch (error) {
                    console.error('Auth error:', error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = (user as any).username;
                token.phone = (user as any).phone;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                (session.user as any).username = token.username;
                (session.user as any).phone = token.phone;
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60, // 24 hours
    },
});
