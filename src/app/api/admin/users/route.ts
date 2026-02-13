import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { requireAdmin } from '@/lib/admin';

// GET: List all Admins and Editors
export async function GET() {
    try {
        const adminCheck = await requireAdmin();
        if (!adminCheck.authorized) return adminCheck.response!;

        const users = await prisma.user.findMany({
            where: {
                role: { in: ['ADMIN', 'EDITOR'] }
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                username: true,
                role: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(users);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

// POST: Create New Admin/Editor
export async function POST(req: NextRequest) {
    try {
        const adminCheck = await requireAdmin();
        if (!adminCheck.authorized) return adminCheck.response!;

        const body = await req.json();
        const { name, email, phone, username, password, role } = body;

        // Basic Validation
        if (!name || !phone || !email || !username || !password || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if username/email/phone exists
        const existing = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email },
                    { phone }
                ]
            }
        });

        if (existing) {
            return NextResponse.json({ error: 'User with this email, phone, or username already exists' }, { status: 400 });
        }

        const hashedPassword = await hash(password, 12);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                username,
                password: hashedPassword,
                role: role as 'ADMIN' | 'EDITOR'
            }
        });

        return NextResponse.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });

    } catch (error) {
        console.error('Create User Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE: Remove Admin
export async function DELETE(req: NextRequest) {
    try {
        const adminCheck = await requireAdmin();
        if (!adminCheck.authorized) return adminCheck.response!;

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        // 1. Fetch User to Check Super Admin
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // PROTECT SUPER ADMIN
        // Assuming 'superadmin' username or a specific Env ID
        // "give the admin user name as super adming that no can remove it"
        if (user.username === 'superadmin' || user.role === 'ADMIN' && user.email === process.env.ADMIN_EMAIL) {
            return NextResponse.json({ error: 'Cannot delete Super Admin' }, { status: 403 });
        }

        await prisma.user.delete({ where: { id } });

        return NextResponse.json({ success: true, message: 'User deleted' });

    } catch {
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}

// PATCH: Update User (Profile or Password)
export async function PATCH(req: NextRequest) {
    try {
        const adminCheck = await requireAdmin();
        if (!adminCheck.authorized) return adminCheck.response!;

        const body = await req.json();
        const { id, newPassword, name, email, phone, username, role } = body;

        if (!id) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const targetUser = await prisma.user.findUnique({
            where: { id },
            select: { username: true, role: true, email: true }
        });
        if (!targetUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const isProtectedUser = targetUser.username === 'superadmin' || (targetUser.role === 'ADMIN' && targetUser.email === process.env.ADMIN_EMAIL);
        if (isProtectedUser) {
            return NextResponse.json({ error: 'Cannot modify Super Admin' }, { status: 403 });
        }

        const updates: {
            password?: string;
            name?: string;
            role?: 'ADMIN' | 'EDITOR';
            email?: string;
            phone?: string;
            username?: string;
        } = {};

        // 1. Handle Password Reset
        if (newPassword) {
            updates.password = await hash(newPassword, 12);
        }

        // 2. Handle Profile Update
        if (name) updates.name = name;
        if (role === 'ADMIN' || role === 'EDITOR') updates.role = role;

        // 3. Handle Unique Fields (Check for duplicates if changed)
        if (email || phone || username) {
            const checks: Array<{ email: string } | { phone: string } | { username: string }> = [];
            if (email) checks.push({ email });
            if (phone) checks.push({ phone });
            if (username) checks.push({ username });

            const existing = await prisma.user.findFirst({
                where: {
                    AND: [
                        { id: { not: id } }, // Exclude current user
                        { OR: checks }
                    ]
                }
            });

            if (existing) {
                return NextResponse.json({ error: 'Email, Phone, or Username already in use' }, { status: 400 });
            }

            if (email) updates.email = email;
            if (phone) updates.phone = phone;
            if (username) updates.username = username;
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updates,
            select: { id: true, name: true, email: true, phone: true, username: true, role: true }
        });

        return NextResponse.json({ success: true, message: 'User updated successfully', user: updatedUser });

    } catch (error) {
        console.error('Update User Error:', error);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
