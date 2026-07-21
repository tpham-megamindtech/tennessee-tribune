import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-200 bg-brand-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
              Tennessee Tribune
            </span>
            <span className="hidden text-xs font-medium uppercase tracking-widest text-brand-700 sm:inline">
              Volunteer State News
            </span>
          </Link>
        </div>

        <nav className="-mx-1 flex flex-wrap gap-x-1 gap-y-1 overflow-x-auto text-sm font-semibold">
          <Link
            href="/"
            className="rounded-full px-3 py-1.5 text-navy-800 transition-colors hover:bg-brand-100 hover:text-brand-800"
          >
            Home
          </Link>
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-navy-800 transition-colors hover:bg-brand-100 hover:text-brand-800"
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
