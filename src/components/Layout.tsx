import { ReactNode } from "react";
import { useRouter } from "next/router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CallButton } from "./CallButton";
import { GhlChatWidget } from "./GhlChatWidget";

export function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  // Keep the marketing chrome (call button, chat) off the internal dashboard.
  const isDashboard = router.pathname.startsWith("/dashboard");

  return (
    <div className="flex min-h-screen flex-col bg-grain">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      {!isDashboard && (
        <>
          <CallButton />
          <GhlChatWidget />
        </>
      )}
    </div>
  );
}
