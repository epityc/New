import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FacelessReels — AI Video Generator",
  description: "Generate viral faceless videos for TikTok, YouTube Shorts and Instagram Reels",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${inter.className} bg-[#0a0a0a] text-white antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
