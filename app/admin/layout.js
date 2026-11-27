export const metadata = {
  title: "Delta Admin",
  description: "Mobile app for authorized Delta Computers administrators.",
  manifest: "/admin.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Delta Admin",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icon-192.png",
  },
};

export const viewport = {
  themeColor: "#05080f",
};

export default function AdminRootLayout({ children }) {
  return children;
}
