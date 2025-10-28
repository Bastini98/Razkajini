// src/components/admin/AdminBlogEditor.tsx
import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  ArrowLeft, Save, Upload, Image as ImageIcon, Trash2, CheckCircle2
} from "lucide-react";

/* ================= Types ================= */
type BlogPost = {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;      // cover
  inside_images: string[] | any; // jsonb
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

type EditorMode = "create" | "edit";

export type AdminBlogEditorProps = {
  mode: EditorMode;
  initialPost: BlogPost | null;
};

/* ================= Consts ================= */
const FALLBACK_COVER = "https://i.ibb.co/4V8kLnm/placeholder-16x9.webp";
const BUCKET = "images";

/* ================= Utils ================= */

// BG → Latin (българска кирилица към латиница за slug)
const BG_MAP: Record<string, string> = {
  а:"a", б:"b", в:"v", г:"g", д:"d", е:"e", ж:"zh", з:"z", и:"i", й:"y",
  к:"k", л:"l", м:"m", н:"n", о:"o", п:"p", р:"r", с:"s", т:"t", у:"u",
  ф:"f", х:"h", ц:"ts", ч:"ch", ш:"sh", щ:"sht", ъ:"a", ь:"", ю:"yu", я:"ya",
  А:"a", Б:"b", В:"v", Г:"g", Д:"d", Е:"e", Ж:"zh", З:"z", И:"i", Й:"y",
  К:"k", Л:"l", М:"m", Н:"n", О:"o", П:"p", Р:"r", С:"s", Т:"t", У:"u",
  Ф:"f", Х:"h", Ц:"ts", Ч:"ch", Ш:"sh", Щ:"sht", Ъ:"a", Ь:"", Ю:"yu", Я:"ya"
};

function transliterateBG(str: string) {
  return str.split("").map(ch => BG_MAP[ch] ?? ch).join("");
}

function slugify(input: string) {
  const latin = transliterateBG(input).toLowerCase();
  return latin
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const unique = <T,>(arr: T[]) => Array.from(new Set(arr));
const imgSrcs = (html: string) => {
  const out: string[] = [];
  const re = /<img[^>]*src=["']([^"']+)["'][^>]*>/gi;
  let m; while ((m = re.exec(html))) out.push(m[1]);
  return unique(out);
};

/* ================= Quill toolbar ================= */
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "link", "image"], // image handler го override-ваме
    ["clean"],
  ],
};
const quillFormats = [
  "header",
  "bold", "italic", "underline",
  "list", "bullet",
  "blockquote", "link", "image",
];

/**
 * Изисквания:
 * - slug auto от Заглавие (BG→Latin), поле read-only
 * - няма Preview/Featured/Status панели
 * - качване на снимки от toolbar „image“:
 *   * веднага ги виждаш (вмъкваме data: URL)
 *   * при Save/Publish качваме в Storage, заменяме data: с public URL
 *   * inside_images = всички http(s) изображения от финалното съдържание
 * - „Запази чернова“ => is_published=false; „Публикувай“ => true + редирект към /admin/blog
 */
const AdminBlogEditor: React.FC<AdminBlogEditorProps> = ({ mode, initialPost }) => {
  const nav = useNavigate();

  // form state
  const [postId, setPostId] = useState<string | null>(initialPost?.id || null);
  const [title, setTitle] = useState(initialPost?.title || "");
  const [subtitle, setSubtitle] = useState(initialPost?.subtitle || "");
  const [slug, setSlug] = useState(initialPost?.slug || "");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || "");
  const [content, setContent] = useState(initialPost?.content || "");
  const [category, setCategory] = useState(initialPost?.category || "");
  const [keywords, setKeywords] = useState(initialPost?.keywords || "");
  const [metaTitle, setMetaTitle] = useState(initialPost?.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(initialPost?.meta_description || "");
  const [metaKeywords, setMetaKeywords] = useState(initialPost?.meta_keywords || "");

  // cover
  const [coverUrl, setCoverUrl] = useState<string | null>(initialPost?.image_url || null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);

  // Quill ref + pending uploads
  const quillRef = useRef<ReactQuill | null>(null);
  // пазим dataURL → File, за да заменим при запис
  const [pendingImages, setPendingImages] = useState<Array<{ dataUrl: string; file: File }>>([]);

  // auto slug
  useEffect(() => { setSlug(slugify(title || "post")); }, [title]);

  // custom image handler: вмъкваме data: URL (видимо веднага)
  useEffect(() => {
    if (!quillRef.current) return;
    const editor: any = quillRef.current.getEditor?.();
    if (!editor) return;

    const toolbar = editor.getModule("toolbar");
    if (!toolbar) return;

    const handler = () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = String(reader.result || "");
          const range = editor.getSelection(true);
          editor.insertEmbed(range ? range.index : 0, "image", dataUrl, "user");
          editor.setSelection((range ? range.index : 0) + 1);
          setPendingImages((prev) => [...prev, { dataUrl, file }]);
        };
        reader.readAsDataURL(file);
      };
      input.click();
    };

    toolbar.addHandler("image", handler);
  }, [quillRef.current]);

  async function ensureUniqueSlug(base: string, currentId?: string | null) {
    let candidate = base || "post";
    let i = 1;
    while (true) {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id,slug")
        .eq("slug", candidate)
        .limit(1)
        .maybeSingle();
      if (error) break;
      if (!data || (currentId && data.id === currentId)) break;
      i += 1;
      candidate = `${base}-${i}`;
    }
    return candidate;
  }

  async function createDraftRow() {
    const unique = await ensureUniqueSlug(slugify(title || "post"), null);
    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        title: title || "Без заглавие",
        subtitle,
        slug: unique,
        excerpt,
        content,
        image_url: null,
        inside_images: [],
        keywords,
        meta_title: metaTitle,
        meta_description: metaDescription,
        meta_keywords: metaKeywords,
        category,
        is_published: false,
        is_featured: false,
      })
      .select("id,slug")
      .single();
    if (error) throw error;
    setPostId(data.id);
    setSlug(data.slug);
    return data.id as string;
  }

  const listToPaths = (files: File[], basePath: string) =>
    files.map((f) => `${basePath}/${Date.now()}-${f.name.replace(/\s+/g, "_")}`);

  // качване на cover + вътрешни снимки (data: → public URL) при Save/Publish
  async function processUploadsAndContent(currentId: string) {
    // cover
    let nextCover = coverUrl;
    if (coverFile) {
      const coverPath = `blogs/${currentId}/cover-${Date.now()}-${coverFile.name.replace(/\s+/g, "_")}`;
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(coverPath, coverFile, { upsert: true });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(coverPath);
      nextCover = pub.publicUrl || null;
    }

    // вътрешни
    let nextHtml = content || "";
    if (pendingImages.length) {
      const basePath = `blogs/${currentId}`;
      const paths = listToPaths(pendingImages.map(p => p.file), basePath);

      for (let i = 0; i < pendingImages.length; i++) {
        const { dataUrl, file } = pendingImages[i];
        const p = paths[i];

        const { error } = await supabase.storage.from(BUCKET).upload(p, file, { upsert: true });
        if (error) throw error;

        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(p);
        const publicUrl = pub.publicUrl;

        // заменяме data: URL с public URL
        nextHtml = nextHtml.split(dataUrl).join(publicUrl);
      }
    }

    // inside_images = всички http(s) изображения след замяната
    const inside = imgSrcs(nextHtml).filter((u) => /^https?:\/\//i.test(u));

    return { cover: nextCover, html: nextHtml, images: inside };
  }

  async function save(publish: boolean) {
    if (saving) return;
    setSaving(true);
    try {
      const finalSlug = await ensureUniqueSlug(slugify(slug || title || "post"), postId);

      let id = postId;
      if (!id) id = await createDraftRow();

      const { cover, html, images } = await processUploadsAndContent(id);

      const { error } = await supabase
        .from("blog_posts")
        .update({
          title: title || "Без заглавие",
          subtitle,
          slug: finalSlug,
          excerpt,
          content: html,
          image_url: cover,
          inside_images: images,
          keywords,
          meta_title: metaTitle,
          meta_description: metaDescription,
          meta_keywords: metaKeywords,
          category,
          is_published: publish ? true : false,
        })
        .eq("id", id);

      if (error) throw error;

      // локално refresh
      setPostId(id);
      setCoverFile(null);
      setSlug(finalSlug);
      setContent(html);
      setPendingImages([]); // вече качени

      if (publish) {
        // към списъка
        nav("/admin/blog");
      }
    } catch (e) {
      console.error(e);
      alert("Грешка при запис.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white border border-sand/30 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-sand/30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => nav("/admin/blog")}
            className="inline-flex items-center gap-2 rounded-xl border border-sand/40 px-3 py-2 text-gray-700 hover:border-teal hover:text-teal transition"
          >
            <ArrowLeft className="w-4 h-4" /> Назад
          </button>
          <span className="text-sm text-gray-500">
            {mode === "create" ? "Нов пост" : "Редакция"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => save(false)}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-2xl bg-sand/20 text-gray-800 px-4 py-2 hover:bg-sand/30 transition disabled:opacity-60"
            title="Запази чернова"
          >
            <Save className="w-4 h-4" /> Запази чернова
          </button>
          <button
            onClick={() => save(true)}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-2xl bg-teal text-white px-4 py-2 shadow hover:bg-teal-dark transition disabled:opacity-60"
            title="Публикувай"
          >
            <CheckCircle2 className="w-4 h-4" /> Публикувай
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-6 p-4 sm:p-6">
        {/* Left */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Заглавие *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Пример: Как да събираме семейни истории"
              className="w-full rounded-xl border border-sand/40 px-4 py-3 outline-none focus:border-teal focus:ring-1 focus:ring-teal"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Подзаглавие</label>
              <input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full rounded-xl border border-sand/40 px-4 py-3 outline-none focus:border-teal focus:ring-1 focus:ring-teal"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Slug (URL)</label>
              <input
                value={slug}
                readOnly
                className="w-full rounded-xl border border-sand/40 bg-sand/10 text-gray-700 px-4 py-3 outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">/blog/{slug || "slug"}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Кратко резюме (excerpt)</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-sand/40 px-4 py-3 outline-none focus:border-teal focus:ring-1 focus:ring-teal"
              placeholder="Кратко изречение/абзац за прегледната карта."
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm text-gray-700 mb-1">Съдържание</label>
              <span className="text-xs text-gray-500">H1/H2/H3, Bold/Italic/Underline, Lists, Quote, Link, Image</span>
            </div>
            <div className="[&_.ql-toolbar]:rounded-t-xl [&_.ql-toolbar]:border-sand/40 [&_.ql-container]:rounded-b-xl [&_.ql-container]:border-sand/40">
              <ReactQuill
                ref={quillRef as any}
                theme="snow"
                value={content}
                onChange={setContent}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Пишете статията тук…"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Снимките се виждат веднага (data URL) и се качват в хранилището при запис.
            </p>
          </div>
        </div>

        {/* Right – meta & cover */}
        <aside className="space-y-5">
          <div className="rounded-2xl border border-sand/30 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">Корица (image_url)</span>
              <Upload className="w-4 h-4 text-gray-500" />
            </div>
            <div className="aspect-[16/9] rounded-xl overflow-hidden bg-sand/20 border border-sand/30 flex items-center justify-center">
              {coverFile ? (
                <img src={URL.createObjectURL(coverFile)} alt="cover" className="w-full h-full object-cover" />
              ) : coverUrl ? (
                <img src={coverUrl} alt="cover" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-8 h-8 text-sand" />
              )}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <label className="inline-flex items-center gap-2 rounded-xl border border-sand/40 px-3 py-2 text-gray-700 hover:border-teal hover:text-teal transition cursor-pointer">
                <Upload className="w-4 h-4" />
                Качи…
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                />
              </label>
              {(coverFile || coverUrl) && (
                <button
                  type="button"
                  onClick={() => { setCoverFile(null); setCoverUrl(null); }}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-red-700 hover:bg-red-50 transition"
                >
                  <Trash2 className="w-4 h-4" /> Премахни
                </button>
              )}
            </div>
          </div>

          {/* SEO */}
          <div className="rounded-2xl border border-sand/30 p-4">
            <h4 className="text-sm text-gray-700 mb-2">SEO мета</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Meta title</label>
                <input
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full rounded-xl border border-sand/40 px-4 py-2.5 outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Meta description</label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-sand/40 px-4 py-2.5 outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Meta keywords</label>
                <input
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  className="w-full rounded-xl border border-sand/40 px-4 py-2.5 outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                  placeholder="ai, family, memories"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Ключови думи (internal)</label>
                <input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full rounded-xl border border-sand/40 px-4 py-2.5 outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                  placeholder="разкази, баба, дядо"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Категория</label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-sand/40 px-4 py-2.5 outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                  placeholder="news / stories / tips"
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminBlogEditor;
