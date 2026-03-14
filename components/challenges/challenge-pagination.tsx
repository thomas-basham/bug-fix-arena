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
      <div>
        <p className="mono-label">Catalog Pages</p>
        <p className="mt-2 text-sm text-slate-700">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {hasPreviousPage && previousHref ? (
          <Link
            href={previousHref}
            className="button-secondary-sm"
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
                ? "button-pagination-current"
                : "button-pagination"
            }
          >
            {pageLink.page}
          </Link>
        ))}

        {hasNextPage && nextHref ? (
          <Link
            href={nextHref}
            className="button-secondary-sm"
          >
            Next
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
