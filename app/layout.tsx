import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Nav from "./components/navigation/navigation";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Comics Reader",
  description: "Comics reader web for local files",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="Uef0m15hRaJcKbjoc6d4A81FK93U4EwXgqeiArhiFHU"
        />
      </head>
      <body className={`${inter.className} flex`}>
        <Nav />
        <div className="h-screen overflow-y-auto w-full">{children}</div>
      </body>
    </html>
  );
}
