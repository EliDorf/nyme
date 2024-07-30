"use client"

import Link from "next/link"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import React, { useState } from "react"
import { SignedIn, UserButton } from "@clerk/nextjs"

export function NewSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <>
      {/* Toggle button for mobile */}
      <button
        className="fixed top-4 left-4 z-20 md:hidden"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
      </button>

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-10 flex h-full w-64 flex-col bg-background border-r border-muted transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out md:hidden`}>
        <div className="flex h-16 shrink-0 items-center justify-between px-4">
          <Link href="#" className="flex items-center gap-2 font-semibold" prefetch={false}>
            <MountainIcon className="h-6 w-6" />
            <span>Nyme.AI</span>
          </Link>
          <button onClick={toggleSidebar}>
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 space-y-2 py-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
            prefetch={false}
          >
            <HomeIcon className="h-5 w-5" />
            Home
          </Link>
          <Link
            href="/credits"
            className="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
            prefetch={false}
          >
            <AwardIcon className="h-5 w-5" />
            Credits
          </Link>
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
            prefetch={false}
          >
            <SignedIn>
              <UserButton />
            </SignedIn>
            Profile
          </Link>
        </nav>
      </div>

      {/* Desktop sidebar (unchanged) */}
      <div className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col bg-background border-r border-muted md:flex">
        {/* ... (rest of the desktop sidebar code remains unchanged) ... */}
      </div>
    </>
  )
}

// ... (rest of the icon components remain unchanged) ...

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}