import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://liveconnectusa.com"),
  title: {
    default: "LiveConnect: Meet the room. Not just a name tag.",
    template: "%s · LiveConnect",
  },
  description:
    "LiveConnect turns every event into an open door. See exactly who's in the room, find the people who matter, and connect or save their details in a single tap.",
  openGraph: {
    title: "LiveConnect: Meet the room. Not just a name tag.",
    description:
      "The live networking app that turns every event into an open room.",
    url: "https://liveconnectusa.com",
    siteName: "LiveConnect",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LiveConnect: Meet the room. Not just a name tag.",
    description:
      "The live networking app that turns every event into an open room.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://use.typekit.net" />
        <link rel="preconnect" href="https://p.typekit.net" />
        <link rel="stylesheet" href="https://use.typekit.net/own8wil.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
