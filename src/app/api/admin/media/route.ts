import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { MediaType } from '@prisma/client';

// R2 Configuration
const getR2Client = () => {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

    if (!accountId || !accessKeyId || !secretAccessKey) {
        return null;
    }

    return new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: { accessKeyId, secretAccessKey },
    });
};

// GET: List all media
export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') as MediaType | null;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where = type ? { type } : {};

    const [media, total] = await Promise.all([
        prisma.media.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.media.count({ where }),
    ]);

    return NextResponse.json({ media, total, page, limit });
}

// POST: Upload new image
export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = getR2Client();
    const bucketName = process.env.R2_BUCKET_NAME;
    const publicUrl = process.env.R2_PUBLIC_URL;

    if (!client || !bucketName) {
        return NextResponse.json({ error: 'R2 not configured' }, { status: 500 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const type = (formData.get('type') as MediaType) || 'OTHER';

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
        }

        // Max 5MB
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
        }

        // Generate unique key
        const timestamp = Date.now();
        const ext = file.name.split('.').pop();
        const folder = type === 'CATEGORY_ICON' ? 'categories'
            : type === 'PRODUCT_IMAGE' ? 'products'
                : type === 'BANNER' ? 'banners'
                    : 'other';
        const key = `images/${folder}/${timestamp}-${file.name}`;

        // Upload to R2
        const buffer = Buffer.from(await file.arrayBuffer());
        await client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: buffer,
            ContentType: file.type,
        }));

        const url = `${publicUrl}/${key}`;

        // Save to database
        const media = await prisma.media.create({
            data: {
                filename: file.name,
                key,
                url,
                type,
                size: file.size,
                mimeType: file.type,
                uploadedBy: session.user?.id,
            },
        });

        return NextResponse.json({ success: true, media });
    } catch (error) {
        console.error('Upload failed:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}

// DELETE: Remove image
export async function DELETE(req: NextRequest) {
    const session = await auth();
    if (!session || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const client = getR2Client();
    const bucketName = process.env.R2_BUCKET_NAME;

    if (client && bucketName) {
        try {
            await client.send(new DeleteObjectCommand({
                Bucket: bucketName,
                Key: media.key,
            }));
        } catch (error) {
            console.error('R2 delete failed:', error);
        }
    }

    await prisma.media.delete({ where: { id } });

    return NextResponse.json({ success: true });
}
