import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar/Sidebar";
import StoreProvider from "@/components/StoreProvider/StoreProvider";
import AuthWrapper from "@/components/AuthWrapper/AuthWrapper";

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
          <StoreProvider>
            <AuthWrapper>
              <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
                <Sidebar />
                <main className="main-layout">
                  {children}
                </main>
              </div>
            </AuthWrapper>
          </StoreProvider>
        </div>
      </body>
    </html>
  );
}
