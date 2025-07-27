import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Climate_Crisis } from "next/font/google";
import "../styles/globals.css";
import { AuthProvider } from "../components/AuthProvider";

export const metadata: Metadata = {
  title: {
    template: '%s | Paccy',
    default: 'Paccy - Transform Your College Application Journey',
  },
  description: 'Transform your college application journey with Paccy\'s comprehensive suite of tools. Track essays, manage deadlines, build academic profiles, and connect with peers - all in one platform.',
  keywords: 'college applications, essay tracker, college admissions, academic planner, extracurricular manager, peer network, college prep, university applications',
  authors: [{ name: 'Paccy Team' }],
  creator: 'Paccy',
  publisher: 'Paccy',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    url: 'https://paccy.io',
    title: 'Paccy - Transform Your College Application Journey',
    description: 'Transform your college application journey with Paccy\'s comprehensive suite of tools. Track essays, manage deadlines, build academic profiles, and connect with peers - all in one platform.',
    images: [
      {
        url: 'https://paccy.io/assets/paccy2.png',
        width: 1200,
        height: 630,
        alt: 'Paccy - College Application Management Platform',
      },
    ],
    siteName: 'Paccy',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@paccyio',
    creator: '@paccyio',
    title: 'Paccy - Transform Your College Application Journey',
    description: 'Transform your college application journey with Paccy\'s comprehensive suite of tools. Track essays, manage deadlines, build academic profiles, and connect with peers - all in one platform.',
    images: ['https://paccy.io/assets/paccy2.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/assets/paccy2.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/assets/paccy2.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${climateCrisis.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
