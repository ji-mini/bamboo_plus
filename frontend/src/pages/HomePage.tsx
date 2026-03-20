import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchApprovedPosts } from "../lib/api";
import { categoryLabelMap, type PostCategory } from "../types";

const categoryOptions: Array<{ label: string; value?: PostCategory }> = [
  { label: "전체" },
  { label: "건의", value: "SUGGESTION" },
  { label: "칭찬", value: "PRAISE" },
  { label: "불만", value: "COMPLAINT" },
  { label: "기타", value: "ETC" },
];

export function HomePage() {
  const [category, setCategory] = useState<PostCategory | undefined>();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts", category],
    queryFn: () => fetchApprovedPosts(category),
  });

  const title = useMemo(() => {
    if (!category) {
      return "승인된 전체 게시글";
    }

    return `${categoryLabelMap[category]} 카테고리`;
  }, [category]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-emerald-700 to-emerald-500 p-8 text-white shadow-lg">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-100">
          Bamboo+
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          익명으로 의견을 남기고, 조직 문화를 더 건강하게 만드세요.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-emerald-50 sm:text-base">
          모든 글은 관리자 승인 후 공개됩니다. 로그인 없이 자유롭게 작성할 수 있습니다.
        </p>
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((option) => {
            const isActive = category === option.value || (!category && !option.value);

            return (
              <button
                key={option.label}
                type="button"
                onClick={() => setCategory(option.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">총 {posts.length}개의 게시글</p>
        </div>

        {isLoading ? (
          <div className="rounded-3xl border border-dashed border-emerald-200 bg-white p-8 text-center text-slate-500">
            게시글을 불러오는 중입니다.
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-emerald-200 bg-white p-8 text-center text-slate-500">
            아직 공개된 게시글이 없습니다.
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <article key={post.id} className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {categoryLabelMap[post.category]}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(post.createdAt).toLocaleString("ko-KR")}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">{post.title}</h3>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {post.content}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
