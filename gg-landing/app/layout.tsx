import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GG | 자취방 제로웨이스트 진단",
  description:
    "자취생이 제로웨이스트를 가장 쉽게 시작하도록 생활 진단과 스타터팩을 제안합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
