import { NavLink, Route, Routes } from "react-router-dom";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminPostsPage } from "./pages/AdminPostsPage";
import { CreatePostPage } from "./pages/CreatePostPage";
import { HomePage } from "./pages/HomePage";

function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_35%),linear-gradient(180deg,_#f8fffb_0%,_#f3f7f5_100%)]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-3xl border border-emerald-100 bg-white/90 p-4 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
                Bamboo+
              </p>
              <p className="mt-1 text-sm text-slate-500">사내 익명 대나무숲 시스템</p>
            </div>

            <nav className="flex flex-wrap gap-2">
              <AppNavLink to="/">홈</AppNavLink>
              <AppNavLink to="/write">글쓰기</AppNavLink>
              <AppNavLink to="/admin/login">관리자</AppNavLink>
            </nav>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/write" element={<CreatePostPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/posts" element={<AdminPostsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function AppNavLink({ to, children }: { to: string; children: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-full px-4 py-2 text-sm font-semibold transition ${
          isActive ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default App;
