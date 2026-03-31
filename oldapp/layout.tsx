import type { Metadata } from "next";
import { Montserrat, Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import ConditionalNav from "./components/ConditionalNav";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TEBO Studio - Making sense of a complex world",
  description: "Data visualisations, interactive tools, and sense-making experiences designed to bring complex ideas to life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${roboto.variable} ${robotoMono.variable} antialiased`}
      >
        <ConditionalNav />
        
        {children}
      </body>
    </html>
  );
}
