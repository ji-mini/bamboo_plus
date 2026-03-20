import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  approvePost,
  clearAdminToken,
  deletePost,
  fetchAdminPosts,
  getAdminToken,
  rejectPost,
} from "../lib/api";
import { categoryLabelMap, statusLabelMap, type PostStatus } from "../types";

const statusTabs: PostStatus[] = ["PENDING", "APPROVED", "REJECTED"];

export function AdminPostsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<PostStatus>("PENDING");
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>({});

  const token = getAdminToken();

  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ["admin-posts", status, token],
    queryFn: () => fetchAdminPosts(status, token as string),
    enabled: Boolean(token),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: ["admin-posts"],
    });

  const approveMutation = useMutation({
    mutationFn: (id: string) => approvePost(id, token as string),
    onSuccess: invalidate,
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectPost(id, reason, token as string),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePost(id, token as string),
    onSuccess: invalidate,
  });

  const content = useMemo(() => {
    if (!token) {
      return (
        <div className="rounded-3xl border border-dashed border-rose-200 bg-white p-8 text-center">
          <p className="text-slate-600">로그인이 필요합니다.</p>
          <button
            type="button"
            onClick={() => navigate("/admin/login")}
            className="mt-4 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            로그인하러 가기
          </button>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="rounded-3xl border border-dashed border-emerald-200 bg-white p-8 text-center text-slate-500">
          게시글을 불러오는 중입니다.
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-3xl border border-dashed border-rose-200 bg-white p-8 text-center text-rose-600">
          {(error as Error).message}
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <div className="rounded-3xl border border-dashed border-emerald-200 bg-white p-8 text-center text-slate-500">
          해당 상태의 게시글이 없습니다.
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {posts.map((post) => (
          <article key={post.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                {categoryLabelMap[post.category]}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {statusLabelMap[post.status]}
              </span>
              <span className="text-xs text-slate-400">
                {new Date(post.createdAt).toLocaleString("ko-KR")}
              </span>
            </div>

            <h2 className="mt-4 text-xl font-semibold text-slate-900">{post.title}</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {post.content}
            </p>

            {post.rejectedReason ? (
              <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                반려 사유: {post.rejectedReason}
              </div>
            ) : null}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                value={rejectReasons[post.id] ?? ""}
                onChange={(event) =>
                  setRejectReasons((prev) => ({ ...prev, [post.id]: event.target.value }))
                }
                className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                placeholder="반려 사유를 입력하세요"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => approveMutation.mutate(post.id)}
                  className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
                >
                  승인
                </button>
                <button
                  type="button"
                  onClick={() =>
                    rejectMutation.mutate({
                      id: post.id,
                      reason: rejectReasons[post.id] ?? "관리자 검토 후 반려되었습니다.",
                    })
                  }
                  className="rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white"
                >
                  반려
                </button>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(post.id)}
                  className="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white"
                >
                  삭제
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  }, [
    approveMutation,
    deleteMutation,
    error,
    isLoading,
    navigate,
    posts,
    rejectMutation,
    rejectReasons,
    token,
  ]);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-3xl bg-slate-900 p-6 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-300">관리자 대시보드</p>
          <h1 className="mt-2 text-3xl font-bold">게시글 승인 및 관리</h1>
        </div>

        <button
          type="button"
          onClick={() => {
            clearAdminToken();
            navigate("/admin/login");
          }}
          className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900"
        >
          로그아웃
        </button>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatus(tab)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                tab === status
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {statusLabelMap[tab]}
            </button>
          ))}
        </div>
      </section>

      {content}
    </div>
  );
}
