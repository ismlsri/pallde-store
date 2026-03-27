import { useState, useEffect } from "react";
import { useLang } from "@/context/LanguageContext";

interface RateData {
  rate: number;
  updatedAt: string;
}

export default function ExchangeRateBar() {
  const [data, setData] = useState<RateData | null>(null);
  const [error, setError] = useState(false);
  const { lang } = useLang();

  useEffect(() => {
    let cancelled = false;
    async function fetchRate() {
      try {
        const res = await fetch(
          "https://api.frankfurter.app/latest?from=USD&to=TRY",
        );
        if (!res.ok) throw new Error("rate fetch failed");
        const json = await res.json();
        if (!cancelled) {
          setData({
            rate: json.rates.TRY,
            updatedAt: json.date,
          });
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    }
    fetchRate();
    const interval = setInterval(fetchRate, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const now = new Date();
  const timeStr = now.toLocaleTimeString(lang === "en" ? "en-US" : "tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateStr = now.toLocaleDateString(lang === "en" ? "en-US" : "tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  if (error || !data) {
    return (
      <div className="bg-gray-900 text-gray-300 text-xs py-1.5 text-center">
        {lang === "en"
          ? "Exchange rate loading..."
          : "Döviz kuru yükleniyor..."}
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-gray-100 text-xs py-1.5 px-4">
      <div className="container mx-auto flex items-center justify-center gap-2 flex-wrap">
        <span className="font-semibold text-emerald-400">
          {lang === "en" ? "Exchange Rate" : "Güncel Kur"}:
        </span>
        <span>
          1 USD = <span className="font-bold text-white">{data.rate.toFixed(4)}</span> TL
        </span>
        <span className="text-gray-500">|</span>
        <span className="text-gray-400">
          {lang === "en" ? "Updated" : "Son Güncelleme"}: {dateStr} {timeStr}
        </span>
        <span className="text-gray-500">|</span>
        <span className="text-gray-400">
          {lang === "en" ? "Source" : "Kaynak"}:{" "}
          <a
            href="https://www.frankfurter.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-400 hover:text-blue-300"
          >
            Frankfurter API (ECB)
          </a>
        </span>
      </div>
    </div>
  );
}
