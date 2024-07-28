import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import type { AppProps } from 'next/app'
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nyme.AI",
  description: "Nyme.AI Generate create Names",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          <main>
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}
return (
  <html lang="en">
    <body>
      {!isAuthPage && (
        <header>
          <button>Sign In</button>
        </header>
      )}
      {children}
    </body>
  </html>
);
}