import { Pool } from "pg";

let pool: Pool | undefined;

function getPool(): Pool {
  if (!pool) {
    const connectionString =
      process.env.DATABASE_URL ??
      process.env.POSTGRES_URL ??
      process.env.DATABASE_URL_UNPOOLED ??
      process.env.POSTGRES_URL_NON_POOLING ??
      process.env.POSTGRES_URL_NO_SSL;
    pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
  }
  return pool;
}

export interface Comment {
  id: number;
  articleSlug: string;
  authorName: string;
  body: string;
  createdAt: string;
}

const MAX_NAME_LENGTH = 60;
const MAX_BODY_LENGTH = 1000;

export async function getApprovedComments(articleSlug: string): Promise<Comment[]> {
  const { rows } = await getPool().query(
    `SELECT id, article_slug, author_name, body, created_at
     FROM comments
     WHERE article_slug = $1 AND approved = TRUE
     ORDER BY created_at ASC`,
    [articleSlug]
  );

  return rows.map((row) => ({
    id: row.id,
    articleSlug: row.article_slug,
    authorName: row.author_name,
    body: row.body,
    createdAt: row.created_at,
  }));
}

export class CommentValidationError extends Error {}

export async function submitComment(
  articleSlug: string,
  authorName: string,
  body: string
): Promise<void> {
  const trimmedName = authorName.trim();
  const trimmedBody = body.trim();

  if (!trimmedName || !trimmedBody) {
    throw new CommentValidationError("Name and comment are required.");
  }
  if (trimmedName.length > MAX_NAME_LENGTH) {
    throw new CommentValidationError("Name is too long.");
  }
  if (trimmedBody.length > MAX_BODY_LENGTH) {
    throw new CommentValidationError("Comment is too long.");
  }

  await getPool().query(
    `INSERT INTO comments (article_slug, author_name, body, approved)
     VALUES ($1, $2, $3, FALSE)`,
    [articleSlug, trimmedName, trimmedBody]
  );
}
