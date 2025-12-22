import type { Metadata } from "next";
import { Archivo, JetBrains_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/context";
import { NotificationProvider } from "@/lib/notificationContext";

const archivo = Archivo({
  variable: "--font-primary",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CityBuild - Construction Marketplace",
  description: "Connect suppliers, contractors, and subcontractors for streamlined construction projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${archivo.variable} ${jetbrainsMono.variable} ${bebasNeue.variable} antialiased`}
      >
        <AppProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AppProvider>
      </body>
    </html>
  );
}
