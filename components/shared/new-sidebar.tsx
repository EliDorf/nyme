"use client"

import Link from "next/link"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import React, { useState } from "react"
import { SignedIn, UserButton, useUser } from "@clerk/nextjs"
import { Home, User, CreditCard, Moon, Sun } from "lucide-react"
import Image from "next/image"

export function NewSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { user } = useUser()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const NavItems = () => (
    <nav className="space-y-4">
      <Link href="/" prefetch={false}>
        <Button variant="ghost" className="w-full justify-start text-lg h-16 px-4">
          <Home className="mr-4 h-7 w-7" />
          Dashboard
        </Button>
      </Link>
      <Link href="/profile" prefetch={false}>
        <Button variant="ghost" className="w-full justify-start text-lg h-16 px-4">
          <User className="mr-4 h-7 w-7" />
          Profile
        </Button>
      </Link>
      <Link href="/credits" prefetch={false}>
        <Button variant="ghost" className="w-full justify-start text-lg h-16 px-4">
          <CreditCard className="mr-4 h-7 w-7" />
          Credits
        </Button>
      </Link>
    </nav>
  )

  return (
    <>
      <button
        className="fixed top-4 left-4 z-20 md:hidden"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? null : <MenuIcon className="h-6 w-6" />}
      </button>
      
      {/* UserButton in top right corner */}
      <div className="fixed top-4 right-4 z-50">
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 flex h-full w-80 flex-col bg-background border-r border-muted shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out md:hidden`}>
        <div className="flex h-20 items-center justify-between px-5 border-b">
          <Link href="/" className="flex items-center gap-3 font-semibold" prefetch={false}>
            <Image src="/output.svg" alt="Nyme.AI Logo" width={32} height={32} />
            <span className="text-xl">Nyme.AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-12 w-12" onClick={toggleTheme}>
              {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </Button>
            <button onClick={toggleSidebar} className="p-3">
              <XIcon className="h-9 w-9" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <NavItems />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col bg-background border-r border-muted md:flex">
        <div className="flex h-14 items-center justify-between border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold" prefetch={false}>
            <Image src="/output.svg" alt="Nyme.AI Logo" width={24} height={24} />
            <span>Nyme.AI</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <NavItems />
        </div>
      </div>
    </>
  )
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

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
