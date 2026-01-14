'use server';

import { prisma } from '@/prisma/prisma-client';
import { authAdmin } from '@/lib/firebase-server';
import { cookies } from 'next/headers';

export async function syncUser(idToken: string) {
    try {
        const decodedToken = await authAdmin.verifyIdToken(idToken);
        const { uid, email, name, phone_number, picture } = decodedToken;

        // Sync with Prisma
        const user = await prisma.user.upsert({
            where: { email: email || `${uid}@firebase.com` },
            update: {
                fullName: name || 'User',
                provider: 'firebase',
                providerId: uid,
            },
            create: {
                email: email || `${uid}@firebase.com`,
                fullName: name || 'User',
                password: '', // Firebase handles auth
                provider: 'firebase',
                providerId: uid,
                verified: new Date(),
            },
        });

        // Optionally set a session cookie for server-side auth checks
        const sessionCookie = await authAdmin.createSessionCookie(idToken, {
            expiresIn: 60 * 60 * 24 * 5 * 1000, // 5 days
        });

        const cookieStore = await cookies();
        cookieStore.set('session', sessionCookie, {
            maxAge: 60 * 60 * 24 * 5,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
        });

        return { success: true, user };
    } catch (error) {
        console.error('Sync Error', error);
        return { success: false, error: 'Failed to sync user' };
    }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}
