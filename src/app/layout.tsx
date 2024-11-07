import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./component/navbar";
import AuthContextProvider, { useAuthContext } from "./context/context";
import FooterSection from "./component/footer";
import { useState } from "react";
import logo from "./logo.ico";
import EmailProtectedRoutes from "./HOC/email-verify-protected";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Blogger",
  description:
    "informative for readers rather than just extraordinary or too cutesy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const [darkTheme, setDarkTheme] = useState(false);
  // const {theme} = useAuthContext()! ;

  return (
    <html lang="en" data-theme={"light dark"}>
      <head>
        <link
          rel="icon"
          href="https://www.freeiconspng.com/thumbs/blogger-logo-icon-png/blogger-logo-icon-png-13.png"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        data-theme={"light dark"}
      >
        <AuthContextProvider>
          <Navbar />
          <EmailProtectedRoutes>{children}</EmailProtectedRoutes>
          <FooterSection />
        </AuthContextProvider>
      </body>
    </html>
  );
}
