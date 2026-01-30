import 'next-auth';
import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            username?: string;
            phone?: string;
            role?: 'USER' | 'ADMIN' | 'EDITOR';
        } & DefaultSession['user'];
    }

    interface User extends DefaultUser {
        username?: string;
        phone?: string;
        role?: 'USER' | 'ADMIN' | 'EDITOR';
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string;
        username?: string;
        phone?: string;
        role?: 'USER' | 'ADMIN' | 'EDITOR';
    }
}

