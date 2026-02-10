import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                console.log('Login attempt for:', credentials?.username);
                const username = credentials?.username as string;
                const password = credentials?.password as string;

                if (!username || !password) {
                    console.log('Missing username or password');
                    throw new Error('Username and password required');
                }

                // Find user
                const user = await prisma.user.findUnique({
                    where: { username },
                });

                if (!user || !user.password) {
                    console.log('User not found or no password:', { username, found: !!user });
                    throw new Error('Invalid credentials');
                }

                console.log('User found:', { id: user.id, role: user.role, hashStart: user.password.substring(0, 10) });

                // Verify password
                const isValid = await bcrypt.compare(password, user.password);

                console.log('Password valid:', isValid);

                if (!isValid) {
                    throw new Error('Invalid credentials');
                }

                return {
                    id: user.id,
                    username: user.username as string,
                    phone: user.phone as string,
                    email: user.email as string,
                    name: user.name as string,
                    role: user.role as 'USER' | 'ADMIN' | 'EDITOR',
                };
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
        maxAge: 24 * 60 * 60, // 24 hours (Daily expiry)
    },
});
