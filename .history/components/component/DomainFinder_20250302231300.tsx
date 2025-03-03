'use client'

import { useState, useEffect } from "react"
import { Search, CreditCard, Globe, X, Sparkles, ArrowRight, Bell, SlidersHorizontal, DollarSign, ChevronRight, TextCursorInput, Shuffle } from 'lucide-react'
import { 
  trackDomainSearchInitiated,
  trackDomainSearchResultsLoaded,
  trackDomainSearchError,
  trackDomainSuggestionClicked,
  trackAddToCart
} from "lib/analytics/dataLayer"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuCheckboxItem } from "../../components/ui/dropdown-menu"
import { Badge } from "../../components/ui/badge"
import { ScrollArea } from "../../components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Skeleton } from "../../components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip"
import { Switch } from "../../components/ui/switch"
import { Label } from "../../components/ui/label"
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { creditFee } from "../../constants"
import { InsufficientCreditsModal } from "../shared/InsufficientCreditsModal"
import { useSuggestions, SuggestionMode } from "./UseSuggestion"
import { updateCredits, getUserById } from "../../lib/actions/user.action"
import { useUserData } from "../../lib/actions/useUserData"

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

const TLDs = ['.com', '.io', '.ai', '.co', '.net'];

const getAffiliateLink = (domain: string) => {
  return `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(domain)}&clickID=2eZ1DcRCpxyKUZtRio1i6XbcUkCXtpSh2w30Ro0&irgwc=1&utm_source=IR&utm_medium=Affiliate&utm_campaign=5673970&affnetwork=ir&ref=ir`;
};

// Track domain registration
const trackRegistration = async (domain: string, userId?: string, userEmail?: string) => {
  try {
    // Track in analytics
    trackAddToCart(domain, 9.99, 'USD', userEmail);
    
    // Track in database if user is logged in
    if (userId) {
      const affiliateLink = getAffiliateLink(domain);
      const response = await fetch('/api/track-domain-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          domainName: domain,
          price: 9.99,
          currency: 'USD',
          affiliateLink
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to track domain registration:', await response.text());
      }
    }
    
    // Open affiliate link
    window.open(getAffiliateLink(domain), '_blank');
  } catch (error) {
    console.error('Error tracking domain registration:', error);
  }
};

export default function DomainFinder() {
  const { user } = useUser();
  const { userData, refetchUserData, isLoading: isLoadingUserData } = useUserData();
  const { suggestions, isLoading: suggestionsLoading, error: suggestionsError, handleSubmit, mode, setMode } = useSuggestions();
  const [searchTerm, setSearchTerm] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isListView, setIsListView] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Handle mobile view after hydration is complete
  useEffect(() => {
    setIsMounted(true)
    const handleResize = () => {
      setIsListView(window.innerWidth < 640)
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Prevent layout shift by hiding the switch until hydrated
  const showSwitch = isMounted
  const [domains, setDomains] = useState<Domain[]>([])
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [domainsChecked, setDomainsChecked] = useState(false)
  const [lastSearchTerm, setLastSearchTerm] = useState("")

  // Placeholder data
  const placeholderDomains: Domain[] = [
    { domain: 'Namye.com', status: { domain: 'Namye.com', zone: 'com', status: 'inactive', summary: 'inactive' } },
    { domain: 'Nyme.io', status: { domain: 'Nyme.io', zone: 'io', status: 'active', summary: 'active' } },
    { domain: 'Nyme.ai', status: { domain: 'Nyme.ai', zone: 'ai', status: 'inactive', summary: 'inactive' } },
    { domain: 'Namin.com', status: { domain: 'Namin.com', zone: 'com', status: 'active', summary: 'active' } },
    { domain: 'Amin.co', status: { domain: 'Amin.co', zone: 'co', status: 'inactive', summary: 'inactive' } },
  ];

  const handleSearch = async () => {
    if (!user || !userData) {
      const errorMsg = 'You must be logged in to search';
      setError(errorMsg);
      trackDomainSearchError('AUTH_ERROR', errorMsg);
      return;
    }

    if (userData.creditBalance < Math.abs(creditFee)) {
      const errorMsg = 'Insufficient credits';
      setError(errorMsg);
      trackDomainSearchError('CREDITS_ERROR', errorMsg);
      return;
    }

    // Track search initiation
    const userEmail = user.primaryEmailAddress?.emailAddress;
    trackDomainSearchInitiated(searchTerm, TLDs, userEmail);

    setIsLoading(true);
    setError(null);
    setLastSearchTerm(searchTerm);

    try {
      await handleSubmit(searchTerm, mode);
      await updateCredits(userData._id.toString(), creditFee);
      await refetchUserData();
      await checkDomains(searchTerm, false); // Initial search
    } catch (err) {
      console.error(err);
      setError('Failed to perform search');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (domainsChecked && user) {
      saveDomains();
    }
  }, [domainsChecked, user]);

  // Check suggested domains after initial search
  useEffect(() => {
    if (hasSearched && suggestions.length > 0 && lastSearchTerm) {
      // Only check the new suggestions, not the original search term again
      const existingDomains = new Set(domains.map(d => d.domain.toLowerCase()));
      const newSuggestions = suggestions.filter(suggestion => 
        !TLDs.some(tld => existingDomains.has((suggestion + tld).toLowerCase()))
      );
      
      if (newSuggestions.length > 0) {
        checkDomains(newSuggestions, true);
      }
    }
  }, [suggestions, hasSearched, lastSearchTerm]);

  const checkDomains = async (searchInput: string | string[], checkSuggestions: boolean) => {
    setIsLoading(true);
    setError(null);
    
    if (!checkSuggestions) {
      setDomains([]); // Only clear domains on initial search
      setHasSearched(true);
    }
    
    try {
      // Handle both string and array inputs
      const domainsToCheck = Array.isArray(searchInput) ? searchInput : [searchInput];
      console.log('Checking domains for:', domainsToCheck);
      
      const domainPromises = domainsToCheck.flatMap(domain =>
        TLDs.map(async (tld): Promise<Domain | null> => {
          const fullDomain = domain + tld;
          try {
            const response = await axios.get(`/api/domains?name=${encodeURIComponent(fullDomain)}`);
            const apiStatus = response.data.status?.[0];
            if (!apiStatus || !apiStatus.status) {
              console.log('Invalid API response for domain:', fullDomain, response.data);
              return null;
            }
            
            // Normalize the status response
            const normalizedStatus = {
              domain: fullDomain,
              zone: tld.replace('.', ''),
              status: apiStatus.status.toLowerCase(),
              summary: apiStatus.summary || apiStatus.status
            };
            
            return {
              domain: fullDomain,
              status: normalizedStatus
            };
          } catch (error) {
            console.error(`Error checking domain ${fullDomain}:`, error);
            return null;
          }
        })
      );
      
      const results = await Promise.all(domainPromises);
      const validDomains = results.filter((domain): domain is Domain => domain !== null);
      console.log('Valid domains:', validDomains);
      
      if (validDomains.length > 0) {
        // Merge new results with existing ones, avoiding duplicates
        setDomains(prevDomains => {
          const newDomains = [...prevDomains];
          validDomains.forEach(domain => {
            if (!newDomains.some(d => d.domain === domain.domain)) {
              newDomains.push(domain);
            }
          });
          return newDomains;
        });
        setDomainsChecked(true);

        // Track search results
        const userEmail = user?.primaryEmailAddress?.emailAddress;
        trackDomainSearchResultsLoaded(
          Array.isArray(searchInput) ? searchInput[0] : searchInput,
          validDomains.length,
          validDomains.some(domain => isAvailable(domain.status.status)),
          validDomains.map(domain => domain.domain),
          userEmail
        );
      } else if (!checkSuggestions) {
        // Only show error for initial search
      const errorMsg = 'No valid domains found';
      setError(errorMsg);
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      trackDomainSearchError('NO_RESULTS', errorMsg, userEmail);
      }
    } catch (err) {
      setError('Failed to check domain availability');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const isAvailable = (status: string) => {
    const lowercaseStatus = status.toLowerCase();
    return (
      lowercaseStatus === "inactive" || 
      lowercaseStatus === "undelegated" || 
      lowercaseStatus === "unknown" || 
      lowercaseStatus === "undelegated inactive" ||
      lowercaseStatus.includes("available")
    );
  };

  const displayDomains = hasSearched && domains.length > 0 ? domains : (hasSearched ? [] : placeholderDomains);
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
        input: searchTerm
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

  const getDisplayStatus = (status: string) => {
    return isAvailable(status) ? "Available" : status;
  };

  return (
    <div className={`flex flex-col bg-gradient-to-b from-background to-muted/20 w-full ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex-1">
        <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-12 items-center gap-2 px-3">
            <h1 className="text-lg font-semibold md:text-xl">Find Your Perfect Domain</h1>
            <div className="ml-auto flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="hidden sm:inline-flex">
                      <CreditCard className="mr-1 h-3 w-3" />
                      {isLoadingUserData ? (
                        <span className="animate-pulse">Loading credits...</span>
                      ) : (
                        <span>{userData?.creditBalance || 0} Credits</span>
                      )}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>Available search credits</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </header>

        <main className="p-2 md:p-3">
          <div className="mx-auto max-w-full space-y-2 md:space-y-4">
            {/* Search Section */}
            <Card className="overflow-hidden">
              <CardContent className="p-3 md:p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Try three letters of a word..."
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
                          <DropdownMenuLabel>Name Generation</DropdownMenuLabel>
                          <DropdownMenuCheckboxItem 
                            checked={mode === 'short'}
                            onCheckedChange={() => setMode('short')}
                          >
                            <TextCursorInput className="mr-2 h-4 w-4" />
                            Short Mode
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem 
                            checked={mode === 'synonym'}
                            onCheckedChange={() => setMode('synonym')}
                          >
                            <Shuffle className="mr-2 h-4 w-4" />
                            Synonym Mode
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
                  
                  {/* Mode Selection */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium">Name Generation Mode:</Label>
                      <div className="flex bg-muted rounded-md p-1">
                        <Button
                          type="button"
                          size="sm"
                          variant={mode === 'short' ? 'default' : 'ghost'}
                          className="rounded-sm px-3"
                          onClick={() => setMode('short')}
                        >
                          <TextCursorInput className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Short</span>
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={mode === 'synonym' ? 'default' : 'ghost'}
                          className="rounded-sm px-3"
                          onClick={() => setMode('synonym')}
                        >
                          <Shuffle className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Synonym</span>
                        </Button>
                      </div>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-xs text-muted-foreground">
                            {mode === 'short' ? 'Generates short, brandable names' : 'Generates names based on synonyms'}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          {mode === 'short' 
                            ? 'Short Mode: Creates concise, brandable names ideal for domains' 
                            : 'Synonym Mode: Creates alternative names based on related concepts'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-2">
                  <div className="flex items-center gap-1 text-red-600">
                    <X className="h-4 w-4" />
                    <p>{error}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI-Powered Suggestions */}
            {suggestions.length > 0 && (
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-base">
                    <Sparkles className="mr-2 h-5 w-5 text-primary" />
                    AI-Powered Suggestions
                    <Badge variant="outline" className="ml-2 px-2 py-0 text-xs">
                      {mode === 'short' ? 'Short Mode' : 'Synonym Mode'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {mode === 'short' 
                      ? 'Short, brandable alternatives based on your search' 
                      : 'Synonym-based alternatives capturing the essence of your search'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                <ScrollArea className="h-[120px] md:h-auto">
                  <div className="grid grid-cols-2 gap-2 pb-2 md:flex md:flex-wrap md:pb-0">
                      {suggestions.map((suggestion) => (
                        <Button
                          key={suggestion}
                          variant="outline"
                          className="h-8 w-full shrink-0 justify-start px-2 text-sm transition-all hover:shadow-md md:h-auto md:w-[calc(33.333%-0.667rem)] md:p-4 md:text-base lg:w-[calc(25%-0.75rem)]"
                                onClick={() => {
                                  const userEmail = user?.primaryEmailAddress?.emailAddress;
                                  trackDomainSuggestionClicked(suggestion, suggestions.indexOf(suggestion) + 1, userEmail);
                            setSearchTerm(suggestion);
                            handleSearch();
                          }}
                        >
                          <div className="flex w-full items-center justify-between gap-1">
                            <span className="font-medium truncate">{suggestion}</span>
                            <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/40 md:h-4 md:w-4" />
                          </div>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Results Tabs */}
            <div className="space-y-4">
              <Tabs defaultValue="available" className="space-y-4">
                <div className="flex items-center justify-between">
                  <TabsList className="w-auto justify-start">
                    <TabsTrigger value="available" className="bg-green-100/80 px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-green-700">Available</span>
                        <Badge variant="secondary" className="ml-2 bg-black/10 px-2">
                          {availableDomains.length}
                        </Badge>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="unavailable" className="bg-red-100/80 px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-red-700">Unavailable</span>
                        <Badge variant="secondary" className="ml-2 bg-black/10 px-2">
                          {unavailableDomains.length}
                        </Badge>
                      </div>
                    </TabsTrigger>
                  </TabsList>
                  {showSwitch && (
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="list-view" className="text-sm">List View</Label>
                      <Switch
                        id="list-view"
                        checked={isListView}
                        onCheckedChange={setIsListView}
                      />
                    </div>
                  )}
                </div>

                <TabsContent value="available" className="space-y-4">
                  {isListView ? (
                    <Card>
                      <CardContent className="p-0">
                        <div className="divide-y">
                          {isLoading ? (
                            Array(3).fill(0).map((_, i) => (
                              <div key={i} className="p-2">
                                <div className="flex items-center justify-between">
                                  <Skeleton className="h-6 w-1/3" />
                                  <Skeleton className="h-6 w-16" />
                                </div>
                                <Skeleton className="mt-2 h-4 w-1/4" />
                              </div>
                            ))
                          ) : (
                            availableDomains.map((domain) => (
                              <div key={domain.domain} className="flex items-center justify-between p-2 hover:bg-muted/50">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{domain.domain}</span>
                                  </div>
                                  <div className="mt-1 text-sm text-muted-foreground">
                                    {getDisplayStatus(domain.status.status)}
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => {
                                      const userEmail = user?.primaryEmailAddress?.emailAddress;
                                      trackRegistration(domain.domain, user?.id, userEmail);
                                    }}
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
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      {isLoading ? (
                        Array(3).fill(0).map((_, i) => (
                          <Card key={i} className="overflow-hidden">
                            <CardHeader className="space-y-1 p-2">
                              <Skeleton className="h-4 w-1/2" />
                              <Skeleton className="h-4 w-1/4" />
                            </CardHeader>
                            <CardContent className="p-2">
                              <div className="space-y-1">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                              </div>
                            </CardContent>
                            <CardFooter className="p-2 pt-0">
                              <Skeleton className="h-10 w-full" />
                            </CardFooter>
                          </Card>
                        ))
                      ) : (
                        availableDomains.map((domain) => (
                          <Card key={domain.domain} className="overflow-hidden transition-all hover:shadow-lg">
                            <CardHeader className="space-y-1 p-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-medium">
                                  {domain.domain}
                                </CardTitle>
                              </div>
                              <CardDescription className="flex items-center gap-2">
                                Status: {getDisplayStatus(domain.status.status)}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="p-3">
                              <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-1 text-sm">
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
                            <CardFooter className="p-3 pt-0">
                              <Button 
                                variant="default" 
                                className="w-full"
                                onClick={() => {
                                  const userEmail = user?.primaryEmailAddress?.emailAddress;
                                  trackRegistration(domain.domain, user?.id, userEmail);
                                }}
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
                    <ScrollArea className="h-[250px] -mx-2 px-2">
                        <div className="space-y-2">
                          {unavailableDomains.map((domain) => (
                            <div
                              key={domain.domain}
                              className="flex items-center justify-between rounded-lg border p-2 transition-colors hover:bg-muted/50"
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

            {userData && userData.creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal featureName="domain_search" />}
          </div>
        </main>
      </div>
    </div>
  )
}
