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
          <link rel="icon" href="/output.png" />
        </head>
        <body>
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
