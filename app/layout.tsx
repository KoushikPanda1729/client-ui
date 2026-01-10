import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/lib/redux-provider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AuthInitializer } from "@/components/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Client UI",
  description: "Next.js application with Redux and TypeScript",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ backgroundColor: "white" }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: "white" }}
      >
        <AntdRegistry>
          <ReduxProvider>
            <AuthInitializer>{children}</AuthInitializer>
          </ReduxProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
