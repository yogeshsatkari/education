// global css
import "../../globals.css";
// import { GeistMono } from "geist/font/mono";
// import { GeistSans } from "geist/font/sans";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="w-full max-w-4xl mx-auto flex items-center justify-center p-4 min-h-screen">
      {children}
    </main>
  );
}
