import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginAdmin, setAdminToken } from "../lib/api";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@bamboo.local");
  const [password, setPassword] = useState("admin1234");

  const mutation = useMutation({
    mutationFn: loginAdmin,
    onSuccess: (result) => {
      setAdminToken(result.token);
      navigate("/admin/posts");
    },
  });

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-slate-900">관리자 로그인</h1>
      <p className="mt-2 text-sm text-slate-500">JWT 기반 인증으로 승인 관리 화면에 접근합니다.</p>

      <form
        className="mt-8 space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate({ email, password });
        }}
      >
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">이메일</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">비밀번호</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400"
          />
        </label>

        {mutation.isError ? (
          <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {mutation.error.message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {mutation.isPending ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
