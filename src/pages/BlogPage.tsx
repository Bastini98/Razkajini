// src/pages/BlogPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Star,
  Sparkles,
  Tag as TagIcon,
  Image as ImageIcon,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

/** ===== Types matching public.blog_posts ===== */
type BlogPost = {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  inside_images: any; // jsonb array of strings
  keywords: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  category: string | null;
  is_published: boolean;
  is_featured: boolean;
  created_at: string; // ISO
  updated_at: string; // ISO
};

const PAGE_SIZE = 12;
const FALLBACK_IMG =
  "https://i.ibb.co/4V8kLnm/placeholder-16x9.webp"; // можеш да смениш с твой

/** ===== Utilities ===== */
function fmtDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("bg-BG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function firstImage(inside: any): string | null {
  try {
    const x = typeof inside === "string" ? JSON.parse(inside) : inside;
    if (Array.isArray(x) && x.length) return x[0];
  } catch {}
  return null;
}

/** ===== Section title (в стила на твоя код) ===== */
const SectionTitle: React.FC<{
  eyebrow?: string;
  title: string;
  sub?: string;
  white?: boolean;
}> = ({ eyebrow, title, sub, white }) => (
  <div className="text-center max-w-4xl mx-auto px-6">
    {eyebrow && (
      <p
        className={`uppercase tracking-[0.2em] mb-3 text-sm ${
          white ? "text-white/70" : "text-teal"
        }`}
      >
        {eyebrow}
      </p>
    )}
    <h2
      className={`text-4xl lg:text-5xl font-pudelinka font-bold ${
        white ? "text-white" : "text-ink"
      }`}
    >
      {title}
    </h2>
    {sub && (
      <p className={`mt-4 text-lg ${white ? "text-white/90" : "text-gray-700"}`}>
        {sub}
      </p>
    )}
  </div>
);

/** ===== Card skeleton ===== */
const CardSkeleton: React.FC = () => (
  <div className="rounded-3xl overflow-hidden border border-sand/30 bg-white shadow-md">
    <div className="aspect-[16/9] bg-sand/30 animate-pulse" />
    <div className="p-6 space-y-3">
      <div className="h-4 w-24 bg-sand/40 rounded animate-pulse" />
      <div className="h-6 w-3/4 bg-sand/40 rounded animate-pulse" />
      <div className="h-4 w-full bg-sand/40 rounded animate-pulse" />
      <div className="h-4 w-2/3 bg-sand/40 rounded animate-pulse" />
      <div className="h-9 w-32 bg-sand/40 rounded-xl animate-pulse mt-2" />
    </div>
  </div>
);

/** ===== Blog card ===== */
const BlogCard: React.FC<{ post: BlogPost; index: number }> = ({ post, index }) => {
  const img =
    post.image_url ||
    firstImage(post.inside_images) ||
    FALLBACK_IMG;

  const cat = post.category?.trim();
  const isFeatured = !!post.is_featured;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 * index, duration: 0.4 }}
      className="group rounded-3xl overflow-hidden border border-sand/30 bg-white shadow-md hover:shadow-xl transition-shadow"
    >
      <Link to={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/9] overflow-hidden bg-sand/20">
          {img ? (
            <img
              src={img}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sand">
              <ImageIcon className="w-8 h-8" />
            </div>
          )}
          {isFeatured && (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-teal text-white text-xs font-colus px-3 py-1 rounded-full shadow">
              <Star className="w-4 h-4" /> Препоръчано
            </span>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
            {cat && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-teal/30 text-teal">
                <TagIcon className="w-4 h-4" />
                {cat}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-gray-500">
              <Calendar className="w-4 h-4" />
              {fmtDate(post.created_at)}
            </span>
          </div>

          <h3 className="text-2xl font-pudelinka text-ink leading-snug">
            {post.title}
          </h3>
          {post.subtitle && (
            <p className="mt-1 text-gray-700">{post.subtitle}</p>
          )}

          {post.excerpt && (
            <p className="mt-3 text-gray-700 line-clamp-3">{post.excerpt}</p>
          )}

          <div className="mt-5">
            <span className="inline-flex items-center gap-2 font-colus text-teal group-hover:text-teal/90">
              Прочети статията <ArrowRight className="w-5 h-5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

/** ===== Main page ===== */
const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageFrom, setPageFrom] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);

  const titleEyebrow = "Нашият дневник";
  const titleMain = "Блог — истории, идеи, полезни насоки";
  const titleSub =
    "Топли текстове за спомени, семейство и детско любопитство — плюс новини от „Разкажи ни“.";

  async function fetchPage(from: number) {
    setLoading(true);
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "id,title,subtitle,slug,excerpt,content,image_url,inside_images,keywords,meta_title,meta_description,meta_keywords,category,is_published,is_featured,created_at,updated_at"
      )
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error loading blog posts:", error.message);
      setLoading(false);
      return;
    }

    const list = (data || []) as BlogPost[];
    setPosts((prev) => (from === 0 ? list : [...prev, ...list]));

    // ако върнатите са по-малко от PAGE_SIZE — няма повече
    setHasMore(list.length === PAGE_SIZE);
    setLoading(false);
    setFirstLoad(false);
  }

  useEffect(() => {
    fetchPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLoadMore = () => {
    const nextFrom = pageFrom + PAGE_SIZE;
    setPageFrom(nextFrom);
    fetchPage(nextFrom);
  };

  const empty = useMemo(() => !loading && posts.length === 0, [loading, posts]);

  return (
    <div className="min-h-screen bg-paper-texture">
      {/* HERO — teal dotted bg */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.15) 1.2px, transparent 1.2px)",
            backgroundSize: "18px 18px",
            backgroundColor: "#0f766e", // teal-dark
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <p className="uppercase tracking-[0.25em] text-white/80 mb-3 text-sm">
              Библиотека от идеи
            </p>
            <h1 className="text-5xl lg:text-7xl font-pudelinka font-bold leading-tight">
              Истории, които стоплят.
            </h1>
            <p className="text-xl text-white/90 leading-relaxed mt-6 max-w-3xl mx-auto">
              Разговори, ритуали, игри и споделени моменти — събрани на едно място.
            </p>
          </motion.div>
        </div>
      </section>

      {/* INTRO COPY */}
      <section className="py-16">
        <SectionTitle
          eyebrow={titleEyebrow}
          title={titleMain}
          sub={titleSub}
        />
      </section>

      {/* GRID */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {firstLoad && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          )}

          {!firstLoad && empty && (
            <div className="rounded-3xl border border-sand/30 bg-white p-10 text-center shadow">
              <Sparkles className="w-8 h-8 mx-auto text-teal mb-3" />
              <h3 className="text-2xl font-pudelinka text-ink">
                Все още няма публикувани статии
              </h3>
              <p className="text-gray-700 mt-2">
                Когато добавите първия публикуван пост, той ще се появи тук.
              </p>
            </div>
          )}

          {!empty && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((p, idx) => (
                  <BlogCard post={p} index={idx} key={p.id} />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={onLoadMore}
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-teal text-white font-colus font-semibold px-7 py-3 rounded-2xl text-lg shadow-md transition hover:bg-teal-dark disabled:opacity-60"
                  >
                    Зареди още
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* SMALL REMINDER (в стила на твоя сайт) */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xl text-gray-700">
            Понякога е нужен само един абзац, за да прегърнеш спомен. Прочети и сподели нататък.
          </p>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
