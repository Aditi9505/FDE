import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Your global CSS, likely includes Tailwind
import AuthProvider from './components/SessionProvider'; // Import the new provider
import Header from './components/Header'; // We'll create this next

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Xeno Insights Dashboard",
  description: "Shopify Data Analytics Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header /> {/* Your global header with logout */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}