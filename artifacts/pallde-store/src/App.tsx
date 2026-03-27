import { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import ContactPage from "@/pages/ContactPage";
import Header from "@/components/Header";
import ExchangeRateBar from "@/components/ExchangeRateBar";
import Footer from "@/components/Footer";
import LoginPage, { AUTH_KEY } from "@/pages/LoginPage";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import ScrollToTop from "@/components/ScrollToTop";

const queryClient = new QueryClient();

function isAuthenticated(): boolean {
  return !!localStorage.getItem(AUTH_KEY);
}

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <ExchangeRateBar />
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/urun/:urlPart" component={ProductDetailPage} />
          <Route path="/iletisim" component={ContactPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

function App() {
  const [authed, setAuthed] = useState<boolean>(isAuthenticated);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <CartProvider>
            {authed ? (
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
              </WouterRouter>
            ) : (
              <LoginPage onLogin={() => setAuthed(true)} />
            )}
          </CartProvider>
        </LanguageProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
