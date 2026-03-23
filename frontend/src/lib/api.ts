import type { AdminAuth, Post, PostCategory, PostStatus } from "../types";

type ApiResponse<T> = {
  message?: string;
  data: T;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
const ADMIN_TOKEN_KEY = "bamboo_plus_admin_token";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const data = (await response.json()) as ApiResponse<T> & { message?: string };

  if (!response.ok) {
    throw new Error(data.message ?? "요청 처리에 실패했습니다.");
  }

  return data.data;
}

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function fetchApprovedPosts(category?: PostCategory) {
  const searchParams = new URLSearchParams();

  if (category) {
    searchParams.set("category", category);
  }

  const query = searchParams.toString();
  return request<Post[]>(`/api/posts${query ? `?${query}` : ""}`);
}

export function createPost(input: {
  title: string;
  content: string;
  category: PostCategory;
  password?: string;
}) {
  return request<Post>("/api/posts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function loginAdmin(input: { email: string; password: string }) {
  return request<AdminAuth>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

function createAdminHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export function fetchAdminPosts(status: PostStatus, token: string) {
  return request<Post[]>(`/api/admin/posts?status=${status}`, {
    headers: createAdminHeaders(token),
  });
}

export function approvePost(id: string, token: string) {
  return request<Post>(`/api/admin/posts/${id}/approve`, {
    method: "PATCH",
    headers: createAdminHeaders(token),
  });
}

export function rejectPost(id: string, reason: string, token: string) {
  return request<Post>(`/api/admin/posts/${id}/reject`, {
    method: "PATCH",
    headers: createAdminHeaders(token),
    body: JSON.stringify({ reason }),
  });
}

export function deletePost(id: string, token: string) {
  return request<Post>(`/api/admin/posts/${id}`, {
    method: "DELETE",
    headers: createAdminHeaders(token),
  });
}
