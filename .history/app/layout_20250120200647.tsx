import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import type { AppProps } from 'next/app'
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import ClarityInit from '../components/clarity-init'
import Clarity from '@microsoft/clarity';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nyme.AI",
  description: "Nyme.AI Generate create Names",
  icons: {
    icon: '/output.png',
    shortcut: '/output.png',
    apple: '/output.png',
  }
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <head>
          {/* Google Tag Manager */}
          <script dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-NZDSTC9H');`
          }} />
          {/* End Google Tag Manager */}
          <link rel="icon" href="/output.png" />
        </head>
        <body>
          {/* Google Tag Manager (noscript) */}
          <noscript dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NZDSTC9H"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>`
          }} />
          {/* End Google Tag Manager (noscript) */}
          {/* Insert ClarityInit to initialize Clarity client-side */}
          <ClarityInit />
          <main>
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}
