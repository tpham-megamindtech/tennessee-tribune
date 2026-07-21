import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import { getCategory } from "@/lib/categories";
import {
  getAllSlugs,
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/content";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
  };
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${dateString}T00:00:00`));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const category = getCategory(article.category);
  const related = getRelatedArticles(article, 3);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {category && (
        <Link
          href={`/category/${category.slug}`}
          className="w-fit rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-brand-800"
        >
          {category.name}
        </Link>
      )}

      <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-navy-900 sm:text-4xl">
        {article.title}
      </h1>

      <p className="mt-3 text-sm font-medium text-navy-500">
        {formatDate(article.date)}
      </p>

      <div className="relative mt-6 aspect-[16/10] w-full overflow-hidden rounded-2xl bg-brand-100">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          priority
          sizes="(min-width: 768px) 768px, 100vw"
          className="object-cover"
        />
      </div>
      {article.imageCredit && (
        <p className="mt-2 text-right text-xs text-navy-400">
          Photo: {article.imageCredit}
        </p>
      )}

      <div
        className="prose-article mt-8 max-w-none text-[17px] leading-relaxed text-navy-800 [&>blockquote]:my-6 [&>blockquote]:border-l-4 [&>blockquote]:border-brand-400 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-navy-600 [&>p]:mb-5"
        dangerouslySetInnerHTML={{ __html: article.contentHtml }}
      />

      {related.length > 0 && (
        <section className="mt-16 border-t border-brand-200 pt-10">
          <h2 className="mb-5 font-serif text-2xl font-bold text-navy-900">
            Related Stories
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((item) => (
              <ArticleCard key={item.slug} article={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
