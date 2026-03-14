import Link from "next/link";

type ChallengePaginationLink = {
  href: string;
  page: number;
  isCurrent: boolean;
};

type ChallengePaginationProps = {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  previousHref?: string;
  nextHref?: string;
  pageLinks: ChallengePaginationLink[];
};

export function ChallengePagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  previousHref,
  nextHref,
  pageLinks,
}: ChallengePaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Challenge pagination"
      className="surface-card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
    >
      <p className="text-sm text-slate-700">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {hasPreviousPage && previousHref ? (
          <Link
            href={previousHref}
            className="inline-flex items-center rounded-full border border-line bg-white/80 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-white"
          >
            Previous
          </Link>
        ) : null}

        {pageLinks.map((pageLink) => (
          <Link
            key={pageLink.page}
            href={pageLink.href}
            aria-current={pageLink.isCurrent ? "page" : undefined}
            className={
              pageLink.isCurrent
                ? "inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-slate-950 px-4 text-sm font-medium text-white"
                : "inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-line bg-white/80 px-4 text-sm font-medium text-slate-900 transition hover:bg-white"
            }
          >
            {pageLink.page}
          </Link>
        ))}

        {hasNextPage && nextHref ? (
          <Link
            href={nextHref}
            className="inline-flex items-center rounded-full border border-line bg-white/80 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-white"
          >
            Next
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
