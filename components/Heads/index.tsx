import type { FC } from "react";
import Head from "next/head";

interface IProps {
  page: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

export const Heads: FC<IProps> = function ({
  page,
  description = "Transform your college application journey with Paccy's comprehensive suite of tools. Track essays, manage deadlines, build academic profiles, and connect with peers - all in one platform.",
  keywords = "college applications, essay tracker, college admissions, academic planner, extracurricular manager, peer network, college prep, university applications, study abroad, college counseling",
  ogImage = "https://paccy.io/assets/paccy2.png",
}) {
  const siteName = "Paccy";
  const siteUrl = "https://paccy.io";
  const fullTitle = page === "Home" ? siteName : `${page} | ${siteName}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/assets/paccy2.png" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Primary Meta Tags */}
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="author" content="Paccy Team" />
      <meta name="keywords" content={keywords} />
      <meta name="theme-color" content="#FEEBD8" />
      <meta name="application-name" content="Paccy" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta
        property="og:image:alt"
        content="Paccy - College Application Management Platform"
      />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@paccyio" />
      <meta name="twitter:creator" content="@paccyio" />
      <meta property="twitter:url" content={siteUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      <meta property="twitter:domain" content="paccy.io" />

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <link rel="canonical" href={siteUrl} />

      {/* Structured Data for Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Paccy",
            url: siteUrl,
            logo: `${siteUrl}/assets/paccy2.png`,
            sameAs: [
              "https://instagram.com/paccy.io",
              "https://github.com/paccy-io",
              "https://twitter.com/paccyio",
            ],
            description: description,
            contactPoint: {
              "@type": "ContactPoint",
              email: "support@paccy.io",
              contactType: "Customer Support",
            },
          }),
        }}
      />
    </Head>
  );
};
