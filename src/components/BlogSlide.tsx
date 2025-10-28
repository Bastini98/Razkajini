// src/components/BlogSlide.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

type Post = {
  id: string;
  slug: string;
  title: string;
  image_url: string | null;
  excerpt: string | null;
  is_featured: boolean;
  created_at: string;
};

const MAX_FEATURED = 3;

const BlogSlide: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      setLoading(true);
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, slug, title, image_url, excerpt, is_featured, created_at")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(MAX_FEATURED);
      if (!error && data) setPosts(data);
      setLoading(false);
    }
    loadFeatured();
  }, []);

  // запълваме празни карти до 3
  const cards = [...posts];
  while (cards.length < MAX_FEATURED) {
    cards.push({
      id: `empty-${cards.length}`,
      slug: "",
      title: "",
      image_url: null,
      excerpt: null,
      is_featured: false,
      created_at: "",
    });
  }

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-center text-4xl sm:text-6xl tracking-light font-pudelinka">
          Блог
        </h2>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {loading && (
            <p className="col-span-3 text-gray-500 text-center">Зареждане…</p>
          )}

          {!loading &&
            cards.map((post, idx) => {
              const isEmpty = !post.is_featured || !post.slug;
              return (
                <article
                  key={post.id || idx}
                  className="group w-full max-w-sm rounded-2xl border border-neutral-200 bg-white transition-shadow hover:shadow-md"
                >
                  {/* Изображение */}
                  <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-2xl bg-neutral-100">
                    {isEmpty ? (
                      <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-neutral-300">
                        <span className="text-sm text-neutral-500">
                          Празно изображение
                        </span>
                      </div>
                    ) : (
                      <img
                        src={post.image_url || "https://i.ibb.co/4V8kLnm/placeholder-16x9.webp"}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>

                  {/* Текст */}
                  <div className="p-5 text-center">
                    {isEmpty ? (
                      <h3 className="text-lg font-semibold text-gray-400">
                        Няма статия
                      </h3>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-center text-ink">
                          <Link
                            to={`/blog/${post.slug}`}
                            className="inline-flex items-center gap-1 hover:text-teal transition"
                          >
                            {post.title}
                            <span className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition">
                              →
                            </span>
                          </Link>
                        </h3>
                        {post.excerpt && (
                          <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </article>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default BlogSlide;
