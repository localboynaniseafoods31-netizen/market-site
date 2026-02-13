import prisma from '@/lib/prisma';

export async function getAdminContacts() {
    try {
        const admins = await prisma.user.findMany({
            where: {
                role: 'ADMIN', // Or { in: ['ADMIN', 'EDITOR'] } if editors should also get alerts
                // For now, strict ADMIN for alerts
            },
            select: {
                email: true,
                phone: true,
                name: true
            }
        });

        const emails = admins
            .map(a => a.email)
            .filter((e): e is string => !!e && e.length > 0);

        const phones = admins
            .map(a => a.phone)
            .filter((p): p is string => !!p && p.length > 0);

        return { emails, phones, admins };
    } catch (error) {
        console.error('Failed to fetch admin contacts:', error);
        return { emails: [], phones: [], admins: [] };
    }
}
