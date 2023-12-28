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
      <body className={inter.className} suppressHydrationWarning={true}>
        <div>
          {" "}
          <Nav />
          {children}
        </div>
      </body>
    </html>
  );
}
