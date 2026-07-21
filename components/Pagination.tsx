import Link from "next/link";

export default function Pagination({
  basePath,
  page,
  totalPages,
}: {
  basePath: string;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-center gap-2"
    >
      <PageLink
        basePath={basePath}
        page={page - 1}
        disabled={page <= 1}
        label="Previous"
      />

      {pages.map((p) => (
        <Link
          key={p}
          href={p === 1 ? basePath : `${basePath}?page=${p}`}
          aria-current={p === page ? "page" : undefined}
          className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
            p === page
              ? "bg-brand-600 text-white"
              : "text-navy-700 hover:bg-brand-100"
          }`}
        >
          {p}
        </Link>
      ))}

      <PageLink
        basePath={basePath}
        page={page + 1}
        disabled={page >= totalPages}
        label="Next"
      />
    </nav>
  );
}

function PageLink({
  basePath,
  page,
  disabled,
  label,
}: {
  basePath: string;
  page: number;
  disabled: boolean;
  label: string;
}) {
  if (disabled) {
    return (
      <span className="cursor-not-allowed rounded-full px-3 py-1.5 text-sm font-semibold text-navy-300">
        {label}
      </span>
    );
  }

  return (
    <Link
      href={page === 1 ? basePath : `${basePath}?page=${page}`}
      className="rounded-full px-3 py-1.5 text-sm font-semibold text-navy-700 hover:bg-brand-100"
    >
      {label}
    </Link>
  );
}
