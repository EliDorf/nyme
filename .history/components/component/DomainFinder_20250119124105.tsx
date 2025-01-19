'use client'

import { useState, useEffect, useRef } from "react"
import { Search, Home, CreditCard, User, Globe, Check, Sparkles, History, BookMarked, ArrowRight, Bell, Menu, Moon, Sun, SlidersHorizontal, ExternalLink, Star, Clock, DollarSign, ChevronRight, LayoutGrid, List } from 'lucide-react'
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
import { useUser } from '@clerk/nextjs'
import axios from 'axios'

interface DomainStatus {
  domain: string;
  zone: string;
  status: string;
  summary: string;
}

interface Domain {
  domain: string;
  status: DomainStatus;
}

interface DomainFinderProps {
  inputDomain: string;
  suggestions: string[];
  shouldCheckDomains: boolean;
}

const TLDs = ['.com', '.io', '.ai', '.co', '.net'];

const getAffiliateLink = (domain: string) => {
  return `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(domain)}&clickID=2eZ1DcRCpxyKUZtRio1i6XbcUkCXtpSh2w30Ro0&irgwc=1&utm_source=IR&utm_medium=Affiliate&utm_campaign=5673970&affnetwork=ir&ref=ir`;
};

export default function DomainFinder({ inputDomain, suggestions, shouldCheckDomains }: DomainFinderProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isListView, setIsListView] = useState(false)
  const [domains, setDomains] = useState<Domain[]>([])
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const { user } = useUser()
  const [isSaving, setIsSaving] = useState(false)
  const [domainsChecked, setDomainsChecked] = useState(false)
  const previousSuggestions = useRef<string[]>([])

  // Placeholder data
  const placeholderDomains: Domain[] = [
    { domain: 'Namye.com', status: { domain: 'Namye.com', zone: 'com', status: 'inactive', summary: 'inactive' } },
    { domain: 'Nyme.io', status: { domain: 'Nyme.io', zone: 'io', status: 'active', summary: 'active' } },
    { domain: 'Nyme.ai', status: { domain: 'Nyme.ai', zone: 'ai', status: 'inactive', summary: 'inactive' } },
    { domain: 'Namin.com', status: { domain: 'Namin.com', zone: 'com', status: 'active', summary: 'active' } },
    { domain: 'Amin.co', status: { domain: 'Amin.co', zone: 'co', status: 'inactive', summary: 'inactive' } },
  ];

  useEffect(() => {
    const suggestionsChanged = JSON.stringify(suggestions) !== JSON.stringify(previousSuggestions.current);
    if (suggestionsChanged) {
      setHasSearched(false);
      previousSuggestions.current = [...suggestions];
    }
    if (shouldCheckDomains && (inputDomain || suggestions.length > 0) && (!hasSearched || suggestionsChanged)) {
      checkDomains();
    }
  }, [shouldCheckDomains, inputDomain, suggestions]);

  useEffect(() => {
    if (domainsChecked && user) {
      saveDomains();
    }
  }, [domainsChecked, user]);

  const checkDomains = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allDomains = [inputDomain, ...suggestions].filter(Boolean);
      const requests = allDomains.flatMap(domain =>
        TLDs.map(tld => axios.get(`/api/domains?name=${encodeURIComponent(domain + tld)}`))
      );
      const responses = await Promise.all(requests);
      const newDomains = responses.map((response, index) => {
        const domain = allDomains[Math.floor(index / TLDs.length)] + TLDs[index % TLDs.length];
        const status = response.data.status[0];
        return {
          domain,
          status
        };
      });
      setDomains(newDomains);
      setHasSearched(true);
      setDomainsChecked(true);
    } catch (err) {
      setError('Failed to check domain availability');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const isAvailable = (status: string) => {
    return status === "inactive" || status === "undelegated" || status === "unknown" || status === "undelegated inactive";
  };

  const displayDomains = hasSearched ? domains : placeholderDomains;
  const sortedDomains = [...displayDomains].sort((a, b) => a.domain.length - b.domain.length);
  const availableDomains = sortedDomains.filter(d => isAvailable(d.status.status)).slice(0, 10);
  const unavailableDomains = sortedDomains.filter(d => !isAvailable(d.status.status)).slice(0, 10);

  const saveDomains = async () => {
    if (!user) {
      console.error('No user logged in');
      setError('You must be logged in to save domains');
      return;
    }
  
    setIsSaving(true);
    try {
      const response = await axios.post('/api/save-domains', {
        domains: [...availableDomains, ...unavailableDomains],
        userId: user.id,
        input: inputDomain
      });
  
      if (response.status !== 200) {
        throw new Error(`Failed to save domains. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error saving domains:', error);
      setError('Failed to save domains. Please try again.');
    } finally {
      setIsSaving(false);
      setDomainsChecked(false);
    }
  };

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
    <div className={`flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/20 ${isDarkMode ? 'dark' : ''}`}>
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
                      onClick={() => checkDomains()}
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
                    {suggestions.map((suggestion, index) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        className="h-auto w-[200px] shrink-0 justify-start p-4 transition-all hover:shadow-md md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]"
                        onClick={() => setSearchTerm(suggestion)}
                      >
                        <div className="flex w-full items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{suggestion}</span>
                            </div>
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
                            <div key={domain.domain} className="flex items-center justify-between p-4 hover:bg-muted/50">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{domain.domain}</span>
                                </div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                  {domain.status.status}
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => window.open(getAffiliateLink(domain.domain), '_blank')}
                                >
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
                        <Card key={domain.domain} className="overflow-hidden transition-all hover:shadow-lg">
                          <CardHeader className="space-y-1 p-4">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base font-medium">
                                {domain.domain}
                              </CardTitle>
                            </div>
                            <CardDescription className="flex items-center gap-2">
                              Status: {domain.status.status}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="space-y-1">
                                  <p className="text-muted-foreground">Zone</p>
                                  <p>{domain.status.zone}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-muted-foreground">Summary</p>
                                  <p>{domain.status.summary}</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="p-4 pt-0">
                            <Button 
                              variant="default" 
                              className="w-full"
                              onClick={() => window.open(getAffiliateLink(domain.domain), '_blank')}
                            >
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
                            key={domain.domain}
                            className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{domain.domain}</p>
                                <p className="text-sm text-muted-foreground">
                                  Status: {domain.status.status}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
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
