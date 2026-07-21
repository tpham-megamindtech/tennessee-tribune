import Image from "next/image";
import Link from "next/link";
import { ArticleMeta } from "@/lib/content";
import { getCategory } from "@/lib/categories";

export default function Hero({ article }: { article: ArticleMeta }) {
  const category = getCategory(article.category);

  return (
    <Link
      href={`/article/${article.slug}`}
      className="group relative flex min-h-[360px] w-full flex-col justify-end overflow-hidden rounded-2xl shadow-lg sm:min-h-[440px]"
    >
      <Image
        src={article.coverImage}
        alt={article.title}
        fill
        priority
        sizes="100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/30 to-transparent" />
      <div className="relative z-10 flex flex-col gap-3 p-6 sm:p-10">
        {category && (
          <span className="w-fit rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {category.name}
          </span>
        )}
        <h1 className="max-w-3xl font-serif text-2xl font-bold leading-tight text-white sm:text-4xl">
          {article.title}
        </h1>
        <p className="max-w-2xl text-sm text-brand-100 sm:text-base">
          {article.excerpt}
        </p>
      </div>
    </Link>
  );
}
