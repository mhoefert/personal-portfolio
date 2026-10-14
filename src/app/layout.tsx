import type { Metadata } from "next";
import { Newsreader, Instrument_Sans, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const serif = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

// Joey's brand font, used only for the "Joey" wordmark on its highlight card.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Michael Hoefert — Product Manager · AI & B2B SaaS",
  description: "Product Manager & B2B SaaS specialist building AI applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${serif.variable} ${sans.variable} ${mono.variable} ${jakarta.variable} min-h-full flex flex-col`}>
        {/* Without JavaScript, show everything the scroll reveal would have faded in. */}
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;translate:none!important}"}</style>
        </noscript>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
