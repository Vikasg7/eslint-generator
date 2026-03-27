import type { Metadata } from "next"
import { Syne, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const syne = Syne({
  subsets:  ["latin"],
  weight:   ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display:  "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets:  ["latin"],
  weight:   ["400", "500"],
  variable: "--font-jetbrains",
  display:  "swap",
})

export const metadata: Metadata = {
  title:       "ESLint Generator — Config done right",
  description: "Answer 5 questions. Get a tailored ESLint config with every rule explained — flat or legacy format, ready to paste.",
  openGraph: {
    title:       "ESLint Generator",
    description: "Tailored ESLint config in 5 questions. Zero signup.",
    type:        "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}