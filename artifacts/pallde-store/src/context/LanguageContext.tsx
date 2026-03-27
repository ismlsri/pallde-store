import { createContext, useContext, useState } from "react";

export type Lang = "tr" | "en";

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangContextType>({ lang: "tr", setLang: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem("pallde_lang") as Lang) || "tr";
  });

  const handleSet = (l: Lang) => {
    localStorage.setItem("pallde_lang", l);
    setLang(l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang: handleSet }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
