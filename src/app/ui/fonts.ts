import { Playfair_Display, Lato } from "next/font/google";


export const Playfair = Playfair_Display({
  variable: "--font-playfair_display",
  subsets: ["latin"],
});

export const lato = Lato({
  variable: '--font-lato',
  weight: "100"
});