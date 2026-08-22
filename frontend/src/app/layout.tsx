import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SoundProvider } from "./lib/SoundContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: 'The Public Ledger — Shadow Parliament Voting',
  description:
    'Cast your shadow vote on the same bills parliament is debating. See how public opinion compares to your elected representatives.',
};

// Matches the hero's dark background so mobile Safari tints its status bar
// and toolbar to the site instead of leaving them their default white —
// which otherwise reads as a stray white band above and below the page.
// `viewportFit: 'cover'` lets the page paint edge-to-edge under those bars
// (rather than stopping short of them), which is what lets Safari's bottom
// toolbar pick up the page's own dark colour instead of falling back to white.
export const viewport: Viewport = {
  // Metadata, not CSS — can't reference the `--color-ledger-bg` custom property,
  // so keep this literal in sync with it by hand (globals.css).
  themeColor: '#122019',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SoundProvider>{children}</SoundProvider>
      </body>
    </html>
  );
}
