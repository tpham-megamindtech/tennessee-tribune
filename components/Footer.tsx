import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-navy-800 bg-navy-900 text-navy-100">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <span className="font-serif text-xl font-bold text-white">
              Tennessee Tribune
            </span>
            <p className="mt-2 max-w-xs text-sm text-navy-300">
              Local news, business, travel, and community stories from across
              the Volunteer State.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-300">
              Categories
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {CATEGORIES.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-navy-200 transition-colors hover:text-brand-300"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-navy-800 pt-6 text-xs text-navy-400">
          &copy; {year} Tennessee Tribune. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
