import { useLang } from "@/context/LanguageContext";
import { tr } from "./tr";
import { en } from "./en";

export function useT() {
  const { lang } = useLang();
  return lang === "en" ? en : tr;
}

export { tr, en };
