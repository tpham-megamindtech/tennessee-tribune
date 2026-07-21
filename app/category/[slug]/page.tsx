import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { getCategoryPage } from "@/lib/content";

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const { page: pageParam } = await searchParams;
  const requestedPage = Number(pageParam) || 1;
  const { items, page, totalPages, total } = getCategoryPage(
    category.slug,
    requestedPage
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 border-b border-brand-200 pb-6">
        <h1 className="font-serif text-3xl font-bold text-navy-900 sm:text-4xl">
          {category.name}
        </h1>
        <p className="mt-2 text-navy-500">{category.description}</p>
        <p className="mt-1 text-sm text-navy-400">{total} articles</p>
      </div>

      {items.length === 0 ? (
        <p className="text-navy-500">No articles in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}

      <Pagination
        basePath={`/category/${category.slug}`}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}
