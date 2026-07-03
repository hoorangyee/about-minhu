import { RootShell } from "@/components/root-shell";
import { buildMetadata, sharedViewport } from "@/lib/metadata";
import "../globals.css";

export const metadata = buildMetadata("ko");
export const viewport = sharedViewport;

export default function KoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RootShell locale="ko">{children}</RootShell>;
}
