import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yawm Habit",
  description: "Daily habit accountability tracker",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/avatars/favicon.ico",
    shortcut: "/avatars/favicon.ico",
    apple: "/avatars/appicon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#020b12",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
