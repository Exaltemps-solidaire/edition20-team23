import type { Metadata } from "next";
import { Archivo_Black, Libre_Franklin } from "next/font/google";
import "./globals.css";

const fontTitre = Archivo_Black({
  variable: "--lb-font-titre",
  weight: "400",
  subsets: ["latin"],
});

const fontTexte = Libre_Franklin({
  variable: "--lb-font-texte",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "L'BURN – Tableau de bord doux",
  description: "Le tableau de bord doux et les notifications choisies de L'BURN.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${fontTitre.variable} ${fontTexte.variable}`}>
      <body>{children}</body>
    </html>
  );
}
