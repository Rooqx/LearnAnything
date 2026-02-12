// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./provider";

// Initialize the Inter font (or your preferred font)
const inter = Inter({ subsets: ["latin"] });

// Metadata for SEO and PWA configurations
export const metadata = {
  title: "Xam | Automated Examination Platform",
  description: "Your smart, automated examination starts here.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* You can add custom link tags or external scripts here if needed */}
      </head>
      <body>
        {/* The 'children' prop will contain all nested routes and pages (like /signup)
          We ensure the entire body takes up the full minimum screen height.
        */}
        <Providers>
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
