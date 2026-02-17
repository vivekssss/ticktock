import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/providers/SessionProvider";

export const metadata: Metadata = {
  title: "ticktock — Timesheet Management",
  description:
    "Manage employee work hours with ticktock. Track attendance and productivity from anywhere, anytime.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
