import { NextRequest, NextResponse } from "next/server";
import { CommentValidationError, getApprovedComments, submitComment } from "@/lib/comments";
import { getAllSlugs } from "@/lib/content";

const DEFAULT_COMMENTS = [
  { id: -1, authorName: "Reader", body: "Thanks for the update on this." },
  { id: -2, authorName: "Reader", body: "Useful to know, appreciate the reporting." },
];

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug || !getAllSlugs().includes(slug)) {
    return NextResponse.json({ error: "Unknown article." }, { status: 400 });
  }

  const comments = await getApprovedComments(slug);
  const now = new Date().toISOString();
  const withDefaults = [
    ...DEFAULT_COMMENTS.map((c) => ({ ...c, createdAt: now })),
    ...comments,
  ];
  return NextResponse.json({ comments: withDefaults });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const slug = body?.slug;
  const authorName = body?.authorName;
  const commentBody = body?.body;

  if (typeof slug !== "string" || !getAllSlugs().includes(slug)) {
    return NextResponse.json({ error: "Unknown article." }, { status: 400 });
  }
  if (typeof authorName !== "string" || typeof commentBody !== "string") {
    return NextResponse.json({ error: "Name and comment are required." }, { status: 400 });
  }

  try {
    await submitComment(slug, authorName, commentBody);
  } catch (err) {
    if (err instanceof CommentValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }

  return NextResponse.json({ ok: true, pending: true }, { status: 201 });
}
