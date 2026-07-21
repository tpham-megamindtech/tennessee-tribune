export type CategorySlug =
  | "local-news"
  | "nail-beauty"
  | "finance-business"
  | "travel-tourism"
  | "community";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: "local-news",
    name: "Local News",
    description: "City, county, and statewide news from across Tennessee.",
  },
  {
    slug: "nail-beauty",
    name: "Nail & Beauty",
    description: "Salons, spas, and beauty trends from the Volunteer State.",
  },
  {
    slug: "finance-business",
    name: "Finance & Business",
    description: "Local economy, small business, and market news.",
  },
  {
    slug: "travel-tourism",
    name: "Travel & Tourism",
    description: "Where to go and what to do across Tennessee.",
  },
  {
    slug: "community",
    name: "Community",
    description: "Festivals, fundraisers, and neighborhood stories.",
  },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
