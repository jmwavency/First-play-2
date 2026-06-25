import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wavency — Studio de Design Numérique",
  description:
    "Wavency est un studio de design numérique qui crée des expériences de marque et de produit fluides. Nous transformons le mouvement, le récit et le code en réalisations qui font vibrer.",
  openGraph: {
    title: "Wavency — Studio de Design Numérique",
    description:
      "Un studio de design numérique qui crée des expériences de marque et de produit fluides.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
