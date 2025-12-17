import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
  Climate_Crisis,
  Lexend,
} from "next/font/google";
import "../styles/globals.css";
import { AuthProvider } from "../components/AuthProvider";

export const metadata: Metadata = {
  title: {
    template: "%s | Paccy",
    default: "Paccy - Transform Your College Application Journey",
  },
  description:
    "Transform your college application journey with Paccy's comprehensive suite of tools. Track essays, manage deadlines, build academic profiles, and connect with peers - all in one platform.",
  keywords:
    "college applications, essay tracker, college admissions, academic planner, extracurricular manager, peer network, college prep, university applications",
  authors: [{ name: "Paccy Team" }],
  creator: "Paccy",
  publisher: "Paccy",
  robots: "index, follow",
  openGraph: {
    type: "website",
    url: "https://paccy.io",
    title: "Paccy - Transform Your College Application Journey",
    description:
      "Transform your college application journey with Paccy's comprehensive suite of tools. Track essays, manage deadlines, build academic profiles, and connect with peers - all in one platform.",
    images: [
      {
        url: "https://paccy.io/assets/paccy2.png",
        width: 1200,
        height: 630,
        alt: "Paccy - College Application Management Platform",
      },
    ],
    siteName: "Paccy",
  },
  twitter: {
    card: "summary_large_image",
    site: "@paccyio",
    creator: "@paccyio",
    title: "Paccy - Transform Your College Application Journey",
    description:
      "Transform your college application journey with Paccy's comprehensive suite of tools. Track essays, manage deadlines, build academic profiles, and connect with peers - all in one platform.",
    images: ["https://paccy.io/assets/paccy2.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#FEEBD8",
      },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Paccy",
  },
  other: {
    "theme-color": "#FEEBD8",
    "msapplication-TileColor": "#141414",
    "msapplication-config": "/browserconfig.xml",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const climateCrisis = Climate_Crisis({
  variable: "--font-climate-crisis",
  subsets: ["latin"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-VC35HKDM18"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-VC35HKDM18');
            `,
          }}
        />

        {/* Additional favicon and PWA meta tags */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/favicon-16x16.png"
          sizes="16x16"
          type="image/png"
        />
        <link
          rel="icon"
          href="/favicon-32x32.png"
          sizes="32x32"
          type="image/png"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          sizes="180x180"
        />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#FEEBD8" />
        <link rel="manifest" href="/site.webmanifest" />

        <meta name="theme-color" content="#FEEBD8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Paccy" />
        <meta name="msapplication-TileColor" content="#141414" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Paccy" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${climateCrisis.variable} ${lexend.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
