import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createPost } from "../lib/api";
import type { PostCategory } from "../types";

const categoryOptions: Array<{ label: string; value: PostCategory }> = [
  { label: "건의", value: "SUGGESTION" },
  { label: "칭찬", value: "PRAISE" },
  { label: "불만", value: "COMPLAINT" },
  { label: "기타", value: "ETC" },
];

const initialForm = {
  title: "",
  content: "",
  category: "SUGGESTION" as PostCategory,
  password: "",
};

export function CreatePostPage() {
  const [form, setForm] = useState(initialForm);
  const [successMessage, setSuccessMessage] = useState("");

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      setSuccessMessage("게시글이 접수되었습니다. 관리자 승인 후 공개됩니다.");
      setForm(initialForm);
    },
  });

  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">익명 글쓰기</h1>
        <p className="mt-2 text-sm text-slate-500">
          비밀번호는 선택 입력이며, 향후 수정/삭제 기능 확장을 위해 해시 저장됩니다.
        </p>
      </div>

      <form
        className="mt-8 space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          setSuccessMessage("");
          mutation.mutate({
            title: form.title,
            content: form.content,
            category: form.category,
            password: form.password || undefined,
          });
        }}
      >
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">제목</span>
          <input
            required
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400"
            placeholder="제목을 입력하세요"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">카테고리</span>
          <select
            value={form.category}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, category: event.target.value as PostCategory }))
            }
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">내용</span>
          <textarea
            required
            rows={10}
            value={form.content}
            onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400"
            placeholder="익명으로 남기고 싶은 내용을 적어주세요"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            비밀번호 (선택)
          </span>
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400"
            placeholder="향후 수정/삭제용 비밀번호"
          />
        </label>

        {mutation.isError ? (
          <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {mutation.error.message}
          </div>
        ) : null}

        {successMessage ? (
          <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
        >
          {mutation.isPending ? "등록 중..." : "게시글 등록"}
        </button>
      </form>
    </div>
  );
}
