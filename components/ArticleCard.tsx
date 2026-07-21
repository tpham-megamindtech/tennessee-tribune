import Image from "next/image";
import Link from "next/link";
import { ArticleMeta } from "@/lib/content";
import { getCategory } from "@/lib/categories";

export default function ArticleCard({ article }: { article: ArticleMeta }) {
  const category = getCategory(article.category);

  return (
    <Link
      href={`/article/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-brand-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-100">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {category && (
          <span className="w-fit rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-brand-800">
            {category.name}
          </span>
        )}
        <h3 className="font-serif text-lg font-bold leading-snug text-navy-900 group-hover:text-brand-700">
          {article.title}
        </h3>
        <p className="line-clamp-2 text-sm text-navy-600">{article.excerpt}</p>
      </div>
    </Link>
  );
}
