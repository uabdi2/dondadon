// Global layout & fonts

import "./globals.css";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata = {
  title: "Don's Professional Car Detailing | Mobile Detailing in Omaha, NE",
  description:
    "Premium mobile car detailing in Omaha, Nebraska. Full details, interior detailing, seat extraction, and express washes — brought to your driveway.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0B0B0B] text-white antialiased">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
