import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dr.IT | Management System",
  description: "Comprehensive ERP and Management System for Dr.IT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
