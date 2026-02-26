import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar/Sidebar";

export const metadata: Metadata = {
  title: "Lincheng - Mini ERP",
  description: "Hệ thống quản lý bán hàng và công nợ nội bộ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
          <Sidebar />
          <main style={{ flex: 1, marginLeft: '280px', padding: '0', background: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
