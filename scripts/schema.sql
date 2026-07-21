CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  article_slug TEXT NOT NULL,
  author_name TEXT NOT NULL,
  body TEXT NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS comments_article_slug_idx ON comments (article_slug);
