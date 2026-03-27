import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { tr } from "@/i18n/tr";
import { en } from "@/i18n/en";

const CREDENTIALS = { username: "superadmin", password: "superadmin" };
export const AUTH_KEY = "pallde_auth_token";

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { lang, setLang } = useLang();
  const t = lang === "en" ? en : tr;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
        localStorage.setItem(AUTH_KEY, btoa(Date.now().toString()));
        onLogin();
      } else {
        setError(t.login.error);
      }
      setLoading(false);
    }, 400);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
      <div className="w-full max-w-sm mx-4">
        {/* Language switcher */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden text-xs font-semibold">
            <button
              onClick={() => setLang("tr")}
              className={`px-3 py-1.5 transition-colors ${lang === "tr" ? "bg-[#c4622d] text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
            >TR</button>
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 transition-colors ${lang === "en" ? "bg-[#c4622d] text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
            >EN</button>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#c4622d]/10 mb-4">
            <svg className="w-7 h-7 text-[#c4622d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{t.login.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{t.login.subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
                {t.login.username}
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#c4622d] focus:ring-2 focus:ring-[#c4622d]/20 outline-none transition text-gray-900 placeholder:text-gray-400 text-sm"
                placeholder={t.login.usernamePlaceholder}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                {t.login.password}
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#c4622d] focus:ring-2 focus:ring-[#c4622d]/20 outline-none transition text-gray-900 placeholder:text-gray-400 text-sm"
                placeholder={t.login.passwordPlaceholder}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg px-4 py-2.5 text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#c4622d] hover:bg-[#a8521f] disabled:opacity-60 text-white font-semibold rounded-lg transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-[#c4622d]/40"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  {t.login.loading}
                </span>
              ) : t.login.submit}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
