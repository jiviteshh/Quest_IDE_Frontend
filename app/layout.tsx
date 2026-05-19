import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/src/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuestIDE — AI-Native Coding Workspace",
  description: "Transform coding problems into intelligent interactive workspaces with AI-powered execution, analysis, and debugging.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex h-screen min-h-0 flex-col overflow-hidden bg-zinc-950 text-zinc-100">
        <Navbar />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
      </body>
    </html>
  );
}
