"use client";

import { useEffect, useState } from "react";

interface Comment {
  id: number;
  authorName: string;
  body: string;
  createdAt: string;
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

export default function CommentSection({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => setComments(data.comments ?? []))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, authorName: name, body }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErrorMessage(data.error ?? "Something went wrong.");
      setStatus("error");
      return;
    }

    setName("");
    setBody("");
    setStatus("sent");
  }

  return (
    <section className="mt-16 border-t border-brand-200 pt-10">
      <h2 className="mb-5 font-serif text-2xl font-bold text-navy-900">Comments</h2>

      {loading ? (
        <p className="text-sm text-navy-500">Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-navy-500">No comments yet.</p>
      ) : (
        <ul className="space-y-5">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded-xl bg-brand-50 p-4">
              <div className="flex items-baseline justify-between">
                <span className="font-semibold text-navy-900">{comment.authorName}</span>
                <span className="text-xs text-navy-400">{formatDate(comment.createdAt)}</span>
              </div>
              <p className="mt-1 text-navy-700">{comment.body}</p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-3">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          required
          className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Add a comment"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={1000}
          required
          rows={3}
          className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {status === "submitting" ? "Posting…" : "Post comment"}
        </button>

        {status === "sent" && (
          <p className="text-sm text-green-700">
            Thanks! Your comment is awaiting moderation and will appear once approved.
          </p>
        )}
        {status === "error" && <p className="text-sm text-red-700">{errorMessage}</p>}
      </form>
    </section>
  );
}
