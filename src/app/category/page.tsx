// Server Component
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import prisma from "@/lib/prisma";
import CategoriesGrid from "@/components/category/CategoriesGrid";

export default async function AllCategoriesPage() {
    const categoriesData = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: {
            _count: {
                select: { products: { where: { inStock: true } } }
            }
        }
    });

    const categories = categoriesData
        .filter(c => c._count.products > 0)
        .map(c => ({
            id: c.id,
            name: c.name,
            image: c.icon || 'https://pub-933f2ca73d7840ab9a8608288c2e1996.r2.dev/images/other/placeholder.png',
            slug: c.slug,
            description: c.description || "Fresh and premium quality"
        }));

    return (
        <main className="min-h-screen bg-background ocean-mesh pb-20">
            <div className="container mx-auto px-4 pt-32 md:pt-24 pb-8">
                <CategoriesGrid categories={categories} />
            </div>

            <BottomNav />
            <Footer />
        </main>
    );
}
