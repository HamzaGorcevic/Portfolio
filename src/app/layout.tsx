import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { keywords, siteDescription, siteTitle, siteUrl } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  keywords,
  authors: [{ name: "Hamza Gorcevic", url: siteUrl }],
  creator: "Hamza Gorcevic",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "profile",
    url: siteUrl,
    siteName: "Hamza Gorcevic",
    title: siteTitle,
    description: siteDescription,
    firstName: "Hamza",
    lastName: "Gorcevic",
    images: [{ url: "/hamza.jpg", alt: "Hamza Gorcevic, software engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/hamza.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Hamza Gorcevic",
      url: siteUrl,
      image: `${siteUrl}/hamza.jpg`,
      jobTitle: "Software Engineer",
      description: siteDescription,
      email: "mailto:hamzagorcevic100@gmail.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Novi Pazar",
        addressCountry: "RS",
      },
      worksFor: { "@type": "Organization", name: "Hubora" },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "State University of Novi Pazar",
      },
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        educationalLevel: "Bachelor's degree",
        name: "BSc in Software Engineering",
        recognizedBy: {
          "@type": "CollegeOrUniversity",
          name: "State University of Novi Pazar",
        },
      },
      knowsAbout: [
        "Node.js",
        "React",
        "JavaScript",
        "TypeScript",
        "Next.js",
        "NestJS",
        "Express",
        "Workflow automation",
        "Business process automation",
        "AI agents",
        "AI harness engineering",
        "Large language models",
        "Retrieval-augmented generation",
        "PostgreSQL",
        "Kafka",
        "OAuth 2.0 / SSO",
      ],
      sameAs: [
        "https://github.com/HamzaGorcevic",
        "https://www.linkedin.com/in/hamza-gor%C4%8Devi%C4%87-112951246/",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#service`,
      name: "Hamza Gorcevic, Software Engineering & AI Automation",
      url: siteUrl,
      image: `${siteUrl}/hamza.jpg`,
      provider: { "@id": `${siteUrl}/#person` },
      areaServed: "Worldwide",
      serviceType: [
        "Workflow automation",
        "AI agent and LLM harness development",
        "Node.js backend development",
        "React and Next.js frontend development",
        "Full-stack JavaScript development",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Hamza Gorcevic",
      about: { "@id": `${siteUrl}/#person` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
