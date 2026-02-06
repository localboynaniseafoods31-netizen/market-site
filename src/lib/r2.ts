import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

// R2 uses S3-compatible API
const getR2Client = () => {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

    if (!accountId || !accessKeyId || !secretAccessKey) {
        console.warn('⚠️ R2 credentials missing. PDF upload will be skipped.');
        return null;
    }

    return new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
    });
};

export const uploadToR2 = async (
    key: string,
    body: Buffer,
    contentType: string = 'application/pdf'
): Promise<string | null> => {
    const client = getR2Client();
    const bucketName = process.env.R2_BUCKET_NAME;
    const publicUrl = process.env.R2_PUBLIC_URL;

    if (!client || !bucketName) {
        console.log('📄 R2 not configured. Skipping PDF upload.');
        console.log('Key would be:', key);
        return null;
    }

    try {
        await client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: body,
            ContentType: contentType,
        }));

        // Construct public URL
        const url = publicUrl
            ? `${publicUrl}/${key}`
            : `https://${bucketName}.${process.env.R2_ACCOUNT_ID}.r2.dev/${key}`;

        console.log('✅ Uploaded to R2:', url);
        return url;

    } catch (error) {
        console.error('❌ R2 Upload Failed:', error);
        return null;
    }
};

export const getR2Url = (key: string): string => {
    const publicUrl = process.env.R2_PUBLIC_URL;
    const bucketName = process.env.R2_BUCKET_NAME;

    if (publicUrl) {
        return `${publicUrl}/${key}`;
    }

    return `https://${bucketName}.${process.env.R2_ACCOUNT_ID}.r2.dev/${key}`;
};
