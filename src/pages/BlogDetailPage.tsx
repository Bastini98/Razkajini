// src/pages/BlogDetailPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Share2,
  Tag as TagIcon,
  Image as ImageIcon,
  ArrowRight,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

type BlogPost = {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  inside_images: any;
  keywords: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  category: string | null;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

const FALLBACK_IMG = "https://i.ibb.co/4V8kLnm/placeholder-16x9.webp";

function fmtDate(iso?: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("bg-BG", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return iso;
  }
}

const Skeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="aspect-[16/9] bg-sand/30 rounded-3xl" />
    <div className="max-w-3xl mx-auto mt-8 space-y-3">
      <div className="h-4 w-28 bg-sand/40 rounded" />
      <div className="h-8 w-3/4 bg-sand/40 rounded" />
      <div className="h-5 w-2/3 bg-sand/40 rounded" />
      <div className="h-4 w-full bg-sand/40 rounded" />
      <div className="h-4 w-5/6 bg-sand/40 rounded" />
    </div>
  </div>
);

const SmallCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  const img = post.image_url || FALLBACK_IMG;
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group rounded-2xl overflow-hidden border border-sand/30 bg-white shadow-md hover:shadow-xl transition"
    >
      <div className="aspect-[16/9] overflow-hidden bg-sand/20">
        <img
          src={img}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
          {post.category && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-teal/30 text-teal">
              <TagIcon className="w-4 h-4" />
              {post.category}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-gray-500">
            <Calendar className="w-4 h-4" />
            {fmtDate(post.created_at)}
          </span>
        </div>
        <h4 className="text-xl font-pudelinka text-ink leading-snug">{post.title}</h4>
        {post.excerpt && <p className="text-gray-700 mt-2 line-clamp-2">{post.excerpt}</p>}
        <div className="mt-4 inline-flex items-center gap-2 text-teal font-colus">
          Прочети <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
};

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [more, setMore] = useState<BlogPost[]>([]);

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  async function loadPost() {
    if (!slug) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "id,title,subtitle,slug,excerpt,content,image_url,inside_images,keywords,meta_title,meta_description,meta_keywords,category,is_published,is_featured,created_at,updated_at"
      )
      .eq("slug", slug)
      .eq("is_published", true)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(error.message);
      setLoading(false);
      return;
    }

    if (!data) {
      setPost(null);
      setLoading(false);
      return;
    }

    setPost(data as BlogPost);
    setLoading(false);

    // Load recommended
    const { data: rec } = await supabase
      .from("blog_posts")
      .select("id,title,slug,excerpt,image_url,category,created_at")
      .eq("is_published", true)
      .neq("id", data.id)
      .order("created_at", { ascending: false })
      .limit(3);

    setMore((rec || []) as BlogPost[]);
  }

  useEffect(() => {
    loadPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (post?.title) document.title = `${post.title} — Разкажи ни`;
  }, [post?.title]);

  const heroImg = post?.image_url || FALLBACK_IMG;

  const isHtml = useMemo(() => {
    const c = post?.content || "";
    return /<\/?[a-z][\s\S]*>/i.test(c);
  }, [post?.content]);

  if (loading) {
    return (
      <div className="min-h-screen bg-paper-texture">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-teal hover:text-teal/90"
          >
            <ArrowLeft className="w-5 h-5" />
            Назад към блога
          </Link>
          <div className="mt-6">
            <Skeleton />
          </div>
        </section>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-paper-texture">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-pudelinka text-ink">Статията не е намерена</h1>
          <p className="text-gray-700 mt-3">
            Възможно е да е премахната или все още да не е публикувана.
          </p>
          <Link
            to="/blog"
            className="mt-6 inline-flex items-center gap-2 bg-teal text-white px-6 py-3 rounded-2xl shadow hover:bg-teal-dark"
          >
            <ArrowLeft className="w-5 h-5" />
            Към всички статии
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-texture">
      {/* Breadcrumbs */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="text-sm text-gray-600">
          <Link to="/" className="hover:text-teal">Начало</Link>
          <span className="mx-2">/</span>
          <Link to="/blog" className="hover:text-teal">Блог</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{post.title}</span>
        </nav>
      </section>

      {/* Hero image */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="relative rounded-3xl overflow-hidden border border-sand/30 bg-white shadow-xl">
          {heroImg ? (
            <img
              src={heroImg}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          ) : (
            <div className="aspect-[16/9] flex items-center justify-center text-sand bg-sand/20">
              <ImageIcon className="w-10 h-10" />
            </div>
          )}
        </div>
      </section>

      {/* Title & meta row */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
          {post.category && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-teal/30 text-teal">
              <TagIcon className="w-4 h-4" />
              {post.category}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {fmtDate(post.created_at)}
          </span>

          {/* Share */}
          <div className="ml-auto">
            <div className="inline-flex items-center gap-2">
              <Share2 className="w-4 h-4 text-gray-500" />
              <a
                className="hover:text-teal"
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>
              <span className="opacity-40">·</span>
              <a
                className="hover:text-teal"
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noreferrer"
              >
                X
              </a>
              <span className="opacity-40">·</span>
              <a
                className="hover:text-teal"
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <h1 className="mt-4 text-4xl lg:text-5xl font-pudelinka text-ink leading-tight">
          {post.title}
        </h1>
        {post.subtitle && (
          <p className="mt-3 text-lg text-gray-700">{post.subtitle}</p>
        )}
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-14">
        <article className="prose prose-lg max-w-none prose-headings:font-pudelinka prose-strong:text-ink prose-a:text-teal">
          {isHtml ? (
            // NOTE: приемаме, че content идва безопасен; ако искаш, мога да добавя DOMPurify.
            <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
          ) : (
            <div>
              {(post.content || "").split("\n").map((para, i) => (
                <p key={i}>{para.trim()}</p>
              ))}
            </div>
          )}
        </article>

        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-teal hover:text-teal/90"
          >
            <ArrowLeft className="w-5 h-5" />
            Назад
          </button>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-teal text-white px-6 py-3 rounded-2xl shadow hover:bg-teal-dark"
          >
            Към всички статии
          </Link>
        </div>
      </section>

      {/* More posts */}
      {more.length > 0 && (
        <section className="py-14 bg-sand-light/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h3 className="text-3xl font-pudelinka text-ink">Още от блога</h3>
              <p className="text-gray-700 mt-2">
                Свързани истории и идеи, които може да ти харесат.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {more.map((m) => (
                <SmallCard key={m.id} post={m} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogDetailPage;
