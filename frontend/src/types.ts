export type PostCategory = "SUGGESTION" | "PRAISE" | "COMPLAINT" | "ETC";
export type PostStatus = "PENDING" | "APPROVED" | "REJECTED";

export type Post = {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  status: PostStatus;
  createdAt: string;
  approvedAt: string | null;
  rejectedReason: string | null;
};

export type AdminAuth = {
  token: string;
  admin: {
    id: string;
    email: string;
    role: string;
  };
};

export const categoryLabelMap: Record<PostCategory, string> = {
  SUGGESTION: "건의",
  PRAISE: "칭찬",
  COMPLAINT: "불만",
  ETC: "기타",
};

export const statusLabelMap: Record<PostStatus, string> = {
  PENDING: "대기",
  APPROVED: "승인",
  REJECTED: "반려",
};
