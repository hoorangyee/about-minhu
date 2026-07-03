import { ogAlt, ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = ogAlt("en");

export default function OpengraphImage() {
  return renderOgImage("en");
}
