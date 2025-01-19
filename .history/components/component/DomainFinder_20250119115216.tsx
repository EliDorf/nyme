'use client'

import { useState } from "react"
import { Search, Home, CreditCard, User, Globe, X, Check, Sparkles, History, BookMarked, ArrowRight, Bell, Menu, Moon, Sun, SlidersHorizontal, ExternalLink, Star, Clock, DollarSign, ChevronRight, LayoutGrid, List } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface DomainFinderProps {
  inputDomain: string;
  suggestions: string[];
  shouldCheckDomains: boolean;
}

export function DomainFinder({ inputDomain, suggestions, shouldCheckDomains }: DomainFinderProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isListView, setIsListView] = useState(false)
  
  const suggestionsData = [
    { name: "Names", category: "Popular", score: 95, trending: true },
    { name: "Nyme", category: "Trending", score: 88, trending: true },
    { name: "Namin", category: "Similar", score: 82, trending: false },
    { name: "Amin", category: "Short", score: 79, trending: false },
    { name: "Namye", category: "Similar", score: 75, trending: true }
  ]
  
  const availableDomains = [
    { 
      name: "Nyme.ai",
      status: "inactive",
      price: "$29/year",
      score: 98,
      metrics: {
        length: "Short",
        pronunciation: "Excellent",
        memorability: "High",
        brandability: 9.5
      }
    },
    { 
      name: "Amin.co",
      status: "inactive",
      price: "$19/year",
      score: 85,
      metrics: {
        length: "Short",
        pronunciation: "Good",
        memorability: "Medium",
        brandability: 8.0
      }
    },
    { 
      name: "Namye.com",
      status: "inactive",
      price: "$12/year",
      score: 92,
      metrics: {
        length: "Short",
        pronunciation: "Good",
        memorability: "High",
        brandability: 8.8
      }
    },
  ]
  
  const unavailableDomains = [
    { name: "Nyme.io", status: "active", lastChecked: "2 hours ago", price: "$1,499" },
    { name: "Nyme.co", status: "active", lastChecked: "1 day ago", price: "$899" },
    { name: "Nyme.com", status: "active", lastChecked: "5 mins ago", price: "$2,999" },
  ]

  const handleSearch = () => {
    setIsLoading(true)
    // Simulate search delay
    setTimeout(() => setIsLoading(false), 1500)
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const NavItems = () => (
    <nav className="space-y-2">
      <Button variant="ghost" className="w-full justify-start">
        <Home className="mr-2 h-4 w-4" />
        Dashboard
      </Button>
      <Button variant="ghost" className="w-full justify-start">
        <History className="mr-2 h-4 w-4" />
        Search History
      </Button>
      <Button variant="ghost" className="w-full justify-start">
        <BookMarked className="mr-2 h-4 w-4" />
        Saved Domains
      </Button>
      <Button variant="ghost" className="w-full justify-start">
        <CreditCard className="mr-2 h-4 w-4" />
        Credits
      </Button>
    </nav>
  )

  return (
    <div className={`flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/20 md:flex-row ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar - Desktop */}
      <div className="hidden w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:block">
        <div className="flex h-14 items-center justify-between border-b px-4">
          <span className="font-semibold">Domain Finder AI</span>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
        <div className="p-4">
          <NavItems />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center gap-4 px-4">
            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SheetHeader className="border-b p-4">
                  <SheetTitle>Domain Finder AI</SheetTitle>
                </SheetHeader>
                <div className="p-4">
                  <NavItems />
                </div>
                <SheetFooter className="absolute bottom-0 w-full border-t p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Dark Mode</span>
                    <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            
            <h1 className="text-lg font-semibold md:text-xl">Find Your Perfect Domain</h1>
            <div className="ml-auto flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="hidden sm:inline-flex">
                      <CreditCard className="mr-1 h-3 w-3" />
                      1820 Credits
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>Available search credits</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <div className="mx-auto max-w-6xl space-y-4 md:space-y-6">
            {/* Search Section */}
            <Card className="overflow-hidden">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter a creative name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex-1 sm:flex-none">
                          <SlidersHorizontal className="mr-2 h-4 w-4" />
                          Filters
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Domain Settings</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem checked>
                          Include TLD variations
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked>
                          Show price estimates
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Price Range</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <DollarSign className="mr-2 h-4 w-4" />
                          Under $50/year
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <DollarSign className="mr-2 h-4 w-4" />
                          $50 - $100/year
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button 
                      className="flex-1 sm:flex-none"
                      onClick={handleSearch}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Skeleton className="h-4 w-4 rounded-full mr-2" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Search
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI-Powered Suggestions */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-primary" />
                  AI-Powered Suggestions
                </CardTitle>
                <CardDescription>
                  Smart alternatives based on your search
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[120px] md:h-auto">
                  <div className="flex flex-nowrap gap-4 pb-4 md:flex-wrap md:pb-0">
                    {suggestionsData.map((suggestion) => (
                      <Button
                        key={suggestion.name}
                        variant="outline"
                        className="h-auto w-[200px] shrink-0 justify-start p-4 transition-all hover:shadow-md md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]"
                      >
                        <div className="flex w-full items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{suggestion.name}</span>
                              {suggestion.trending && (
                                <Badge variant="secondary" className="ml-2">Trending</Badge>
                              )}
                            </div>
                            <span className="mt-1 text-xs text-muted-foreground">
                              {suggestion.category} • Score: {suggestion.score}%
                            </span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
                        </div>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Results Tabs */}
            <Tabs defaultValue="available" className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList className="w-auto justify-start">
                  <TabsTrigger value="available" className="text-green-600 data-[state=active]:bg-green-100 dark:text-green-400 dark:data-[state=active]:bg-green-900/20">
                    Available
                    <Badge variant="secondary" className="ml-2 hidden sm:inline-flex bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                      {availableDomains.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="unavailable" className="text-red-600 data-[state=active]:bg-red-100 dark:text-red-400 dark:data-[state=active]:bg-red-900/20">
                    Unavailable
                    <Badge variant="secondary" className="ml-2 hidden sm:inline-flex bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                      {unavailableDomains.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="list-view" className="text-sm">List View</Label>
                  <Switch
                    id="list-view"
                    checked={isListView}
                    onCheckedChange={setIsListView}
                  />
                </div>
              </div>

              <TabsContent value="available" className="space-y-4">
                {isListView ? (
                  <Card>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {isLoading ? (
                          Array(3).fill(0).map((_, i) => (
                            <div key={i} className="p-4">
                              <div className="flex items-center justify-between">
                                <Skeleton className="h-6 w-1/3" />
                                <Skeleton className="h-6 w-16" />
                              </div>
                              <Skeleton className="mt-2 h-4 w-1/4" />
                            </div>
                          ))
                        ) : (
                          availableDomains.map((domain) => (
                            <div key={domain.name} className="flex items-center justify-between p-4 hover:bg-muted/50">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{domain.name}</span>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge 
                                          variant={domain.score >= 90 ? "default" : "secondary"}
                                          className="transition-colors"
                                        >
                                          {domain.score}%
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>Domain quality score</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                  {domain.metrics.length} • {domain.metrics.pronunciation}
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="font-medium">{domain.price}</span>
                                <Button variant="outline" size="sm">
                                  Register
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {isLoading ? (
                      Array(3).fill(0).map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                          <CardHeader className="space-y-2 p-4">
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-1/4" />
                          </CardHeader>
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-3/4" />
                            </div>
                          </CardContent>
                          <CardFooter className="p-4 pt-0">
                            <Skeleton className="h-10 w-full" />
                          </CardFooter>
                        </Card>
                      ))
                    ) : (
                      availableDomains.map((domain) => (
                        <Card key={domain.name} className="overflow-hidden transition-all hover:shadow-lg">
                          <CardHeader className="space-y-1 p-4">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base font-medium">
                                {domain.name}
                              </CardTitle>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge 
                                      variant={domain.score >= 90 ? "default" : "secondary"}
                                      className="transition-colors"
                                    >
                                      {domain.score}%
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>Domain quality score</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <CardDescription className="flex items-center gap-2">
                              <DollarSign className="h-3 w-3" />
                              {domain.price}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="space-y-1">
                                  <p className="text-muted-foreground">Length</p>
                                  <p>{domain.metrics.length}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-muted-foreground">Pronunciation</p>
                                  <p>{domain.metrics.pronunciation}</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="p-4 pt-0">
                            <Button variant="default" className="w-full">
                              Register Domain
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="unavailable">
                <Card>
                  <CardHeader>
                    <CardDescription>
                      These domains are currently registered
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] -mx-4 px-4">
                      <div className="space-y-2">
                        {unavailableDomains.map((domain) => (
                          <div
                            key={domain.name}
                            className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{domain.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Estimated Value: {domain.price}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="hidden text-sm text-muted-foreground sm:inline">
                                <Clock className="mr-1 inline-block h-3 w-3" />
                                Checked {domain.lastChecked}
                              </span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                      <Bell className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Get notified if available</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
