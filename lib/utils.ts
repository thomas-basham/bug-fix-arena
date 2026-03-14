export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatRelativeDate(dateString: string) {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffInDays = Math.max(0, Math.round((now - then) / 86_400_000));

  if (diffInDays === 0) {
    return "today";
  }

  if (diffInDays === 1) {
    return "1 day ago";
  }

  if (diffInDays < 30) {
    return `${diffInDays} days ago`;
  }

  const diffInMonths = Math.round(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`;
}

export function getSearchParamValue(
  value: string | string[] | undefined,
) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function parsePositiveInteger(
  value: string | undefined,
  fallback: number,
) {
  if (!value) {
    return fallback;
  }

  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    return fallback;
  }

  return parsedValue;
}

export function buildPathWithQuery(
  pathname: string,
  params: Record<string, string | number | undefined>,
) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") {
      continue;
    }

    searchParams.set(key, String(value));
  }

  const queryString = searchParams.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}
