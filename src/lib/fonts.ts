import { Geist_Mono, Nanum_Myeongjo } from "next/font/google";
import localFont from "next/font/local";

export const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

export const myeongjo = Nanum_Myeongjo({
  weight: ["700", "800"],
  variable: "--font-myeongjo",
  preload: false,
  display: "swap",
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const fontClassNames = `${pretendard.variable} ${myeongjo.variable} ${geistMono.variable}`;
