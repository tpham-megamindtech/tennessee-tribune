import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { CategorySlug } from "./categories";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  category: CategorySlug;
  date: string;
  excerpt: string;
  coverImage: string;
  imageCredit?: string;
  featured?: boolean;
}

export interface ArticleMeta extends ArticleFrontmatter {
  filename: string;
}

export interface Article extends ArticleMeta {
  contentHtml: string;
}

function loadAllMeta(): ArticleMeta[] {
  const filenames = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md"));

  const articles = filenames.map((filename) => {
    const fullPath = path.join(ARTICLES_DIR, filename);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(raw);
    return { ...(data as ArticleFrontmatter), filename };
  });

  articles.sort((a, b) => (a.date < b.date ? 1 : -1));

  return articles;
}

export function getAllArticles(): ArticleMeta[] {
  return loadAllMeta();
}

export function getArticlesByCategory(category: CategorySlug): ArticleMeta[] {
  return loadAllMeta().filter((a) => a.category === category);
}

export function getFeaturedArticle(): ArticleMeta {
  const all = loadAllMeta();
  return all.find((a) => a.featured) ?? all[0];
}

export function getLatestByCategory(category: CategorySlug, limit = 4): ArticleMeta[] {
  return getArticlesByCategory(category).slice(0, limit);
}

const PAGE_SIZE = 9;

export function getCategoryPage(category: CategorySlug, page: number) {
  const all = getArticlesByCategory(category);
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const items = all.slice(start, start + PAGE_SIZE);
  return { items, totalPages, page: safePage, total: all.length };
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const meta = loadAllMeta().find((a) => a.slug === slug);
  if (!meta) return null;

  const fullPath = path.join(ARTICLES_DIR, meta.filename);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { content } = matter(raw);

  const processed = await remark().use(remarkGfm).use(remarkHtml).process(content);

  return { ...meta, contentHtml: processed.toString() };
}

export function getRelatedArticles(article: ArticleMeta, limit = 3): ArticleMeta[] {
  return getArticlesByCategory(article.category)
    .filter((a) => a.slug !== article.slug)
    .slice(0, limit);
}

export function getAllSlugs(): string[] {
  return loadAllMeta().map((a) => a.slug);
}
