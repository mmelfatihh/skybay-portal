import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SKYBAY CINEMAS // Portal",
  description: "Experience Operations & Career Suite",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-white/20 selection:text-white">
        <div className="glass-grain" />
        {children}
      </body>
    </html>
  );
}