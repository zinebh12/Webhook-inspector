import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/tanStack.provider";

export const metadata: Metadata = {
  title: "Webhook Inspector",
  description: "Inspect and debug webhooks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
