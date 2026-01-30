import { MetadataRoute } from 'next';
import { getAllCategories, getAllProducts } from '@/data/seafoodData';

const BASE_url = 'https://oceanfresh.com'; // Replace with actual domain

export default function sitemap(): MetadataRoute.Sitemap {
    // 1. Static Routes
    const staticRoutes = [
        '',
        '/about',
        '/contact',
        '/shipping',
        '/privacy',
        '/terms',
    ].map((route) => ({
        url: `${BASE_url}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    // 2. Category Routes
    const categories = getAllCategories().map((cat) => ({
        url: `${BASE_url}/category/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    // 3. Product Routes
    const products = getAllProducts().map((product) => ({
        url: `${BASE_url}/product/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
    }));

    return [...staticRoutes, ...categories, ...products];
}
