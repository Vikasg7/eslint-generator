import type { Metadata } from "next";
import { JetBrains_Mono, Syne } from "next/font/google";

import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Intuitive ESLint Generator",
  description:
    "Walk through five quick questions and generate a tailored ESLint config with install commands, rule explanations, and a shareable URL.",
  openGraph: {
    title: "Intuitive ESLint Generator",
    description:
      "ESLint config, done right. Generate a tailored config with explanations and a shareable URL.",
    siteName: "Intuitive ESLint Generator",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
