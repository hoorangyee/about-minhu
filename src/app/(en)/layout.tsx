import { RootShell } from "@/components/root-shell";
import { buildMetadata, sharedViewport } from "@/lib/metadata";
import "../globals.css";

export const metadata = buildMetadata("en");
export const viewport = sharedViewport;

export default function EnLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RootShell locale="en">{children}</RootShell>;
}
