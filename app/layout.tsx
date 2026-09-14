import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DREAMFRAME | AI Image Generator & Visual Synthesis",
  description: "Create studio-quality AI visuals, cinematic concept art, and high-fidelity assets with DREAMFRAME.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${outfit.variable} dark antialiased`}
    >
      <body className="bg-black text-[#f5f5f7] font-sans selection:bg-white/20 selection:text-white">
        {children}
      </body>
    </html>
  );
}
