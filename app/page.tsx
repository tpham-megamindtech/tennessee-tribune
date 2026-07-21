import Link from "next/link";
import Hero from "@/components/Hero";
import ArticleCard from "@/components/ArticleCard";
import { CATEGORIES } from "@/lib/categories";
import { getFeaturedArticle, getLatestByCategory } from "@/lib/content";

export default function HomePage() {
  const featured = getFeaturedArticle();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Hero article={featured} />

      {CATEGORIES.map((category) => {
        const articles = getLatestByCategory(category.slug, 4);
        if (articles.length === 0) return null;

        return (
          <section key={category.slug} className="mt-14">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-navy-900">
                  {category.name}
                </h2>
                <p className="mt-1 text-sm text-navy-500">
                  {category.description}
                </p>
              </div>
              <Link
                href={`/category/${category.slug}`}
                className="whitespace-nowrap text-sm font-semibold text-brand-700 hover:text-brand-800"
              >
                View all &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
