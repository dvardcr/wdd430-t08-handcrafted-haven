import type { Metadata } from "next";
import { Playfair, lato } from "@/app/ui/fonts";
import "@/app/ui/global.css";
import styles from "@/app/style.module.css";
import { Providers } from './providers';

export const metadata: Metadata = {
  title: "Handcrafted Haven",
  description: "A home for all things crafted. Join our community of quality products and homely ideas.",
  
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${Playfair.variable} ${lato.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
