import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata = {
  title: {
    default: "Delta Computers | Technology Providers",
    template: "%s | Delta Computers",
  },
  description:
    "Shop laptops, desktop PCs, components and accessories at Delta Computers, Golden Town, Karachi.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  verification: {
    google: "5PCiNK1_YgSh2r7gl1N81unrkRTQbrUZkXKhD0Ioqjg",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>{children}</body>
    </html>
  );
}
