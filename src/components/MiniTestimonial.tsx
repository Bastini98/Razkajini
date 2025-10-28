import React from "react";
import { Star } from "lucide-react";

export type MiniTestimonialData = {
  stars?: number;           // 1..5
  quote?: string;
  author?: string;
  label?: string;           // напр. "Доволен клиент"
  avatar?: string;          // URL
};

const MiniTestimonial: React.FC<{ data?: MiniTestimonialData }> = ({ data }) => {
  if (!data) return null;

  const stars = Math.max(0, Math.min(5, Math.round(data.stars ?? 5)));

  return (
    <div className="rounded-2xl border border-yellow-200 bg-yellow-50/60 p-5 sm:p-6">
      <div className="flex items-center gap-1 text-yellow-500 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < stars ? "fill-yellow-400" : ""}`} />
        ))}
      </div>
      {data.quote && (
        <p className="italic text-gray-800 mb-4">“{data.quote.replace(/^["“]|["”]$/g, "")}”</p>
      )}
      <div className="flex items-center gap-3">
        <img
          src={data.avatar || "https://i.ibb.co/2yKdJtV/avatar-placeholder.png"}
          alt={data.author || "Клиент"}
          className="h-10 w-10 rounded-full object-cover border border-yellow-200"
          loading="lazy"
        />
        <div>
          <div className="font-medium text-gray-900">{data.author || "Анонимен"}</div>
          <div className="text-xs text-gray-500">{data.label || "Клиент"}</div>
        </div>
      </div>
    </div>
  );
};

export default MiniTestimonial;
