import React, { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from 'axios';
import { useUser } from '@clerk/nextjs';

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

export function DomainFinder({ inputDomain, suggestions, shouldCheckDomains }: DomainFinderProps) {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const { user } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [domainsChecked, setDomainsChecked] = useState(false);
  const previousSuggestions = useRef<string[]>([]);

  // Placeholder data
  const placeholderDomains: Domain[] = [
      { domain: 'Namye.com', status: { domain: 'Namye.com', zone: 'com', status: 'inactive', summary: 'inactive' } },
      { domain: 'Nyme.io', status: { domain: 'Nyme.io', zone: 'io', status: 'active', summary: 'active' } },
      { domain: 'Nyme.ai', status: { domain: 'Nyme.ai', zone: 'ai', status: 'inactive', summary: 'inactive' } },
      { domain: 'Namin.com', status: { domain: 'Namin.com', zone: 'com', status: 'active', summary: 'active' } },
      { domain: 'Amin.co', status: { domain: 'Amin.co', zone: 'co', status: 'inactive', summary: 'inactive' } },
      { domain: 'Nyme.com', status: { domain: 'Nyme.com', zone: 'com', status: 'active', summary: 'active' } },
      { domain: 'Namye.net', status: { domain: 'Namye.net', zone: 'net', status: 'inactive', summary: 'inactive' } },
      { domain: 'Namsye.ia', status: { domain: 'Namsye.ia', zone: 'ia', status: 'inactive', summary: 'inactive' } },
      { domain: 'Names.com', status: { domain: 'Names.com', zone: 'com', status: 'active', summary: 'active' } },
      { domain: 'Nyme.co', status: { domain: 'Nyme.co', zone: 'co', status: 'active', summary: 'active' } },
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
      console.log('Attempting to save domains:', {
        availableDomains,
        unavailableDomains,
        userId: user.id,
        input: inputDomain
      });
      console.log('Current user:', user);
      const response = await axios.post('/api/save-domains', {
        domains: [...availableDomains, ...unavailableDomains],
        userId: user.id,
        input: inputDomain
      });
  
      console.log('Save domains response:', response);
  
      if (response.status === 200) {
        console.log("Domains saved successfully");
      } else {
        throw new Error(`Failed to save domains. Status: ${response.status}`);
      }
    } catch (error: unknown) {
      console.error('Error saving domains:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
      } else {
        console.error('Unexpected error:', error);
      }
      setError('Failed to save domains. Please try again.');
    } finally {
      setIsSaving(false);
      setDomainsChecked(false);
    }
  };

  return (
      <div className="flex flex-col gap-4">
          {isLoading && <p>Checking domain availability...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!isLoading && !error && (
          <div className="border rounded-lg overflow-auto shadow-md">
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead className="py-2 px-4 bg-gray-100 dark:bg-gray-800">Available Domains</TableHead>
                          <TableHead className="py-2 px-4 bg-gray-100 dark:bg-gray-800">
                              Not Available ({unavailableDomains.length} domains)
                              {!hasSearched && <span className="text-xs text-gray-500"> (Placeholder data)</span>}
                          </TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {Array.from({ length: Math.max(availableDomains.length, unavailableDomains.length) }).map((_, index) => (
                          <TableRow key={index}>
                              <TableCell className={`py-2 px-4 ${hasSearched ? 'available-domain-cell' : ''}`}>
                                  {availableDomains[index] && (
                                      <div className="flex items-center gap-2">
                                          <GlobeIcon className="w-4 h-4 shrink-0 text-green-500" />
                                          <a
                                            href={getAffiliateLink(availableDomains[index].domain)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline"
                                          >
                                            {availableDomains[index].domain}
                                          </a>
                                          <span className="text-xs text-gray-700 dark:text-gray-300">({availableDomains[index].status.status})</span>
                                      </div>
                                  )}
                              </TableCell>
                              <TableCell className={`py-2 px-4 ${hasSearched ? 'not-available-domain-cell' : ''}`}>
                                  {unavailableDomains[index] && (
                                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                          <DoorClosedIcon className="w-4 h-4 shrink-0 text-red-500" />
                                          <span>{unavailableDomains[index].domain}</span>
                                          <span className="text-xs">({unavailableDomains[index].status.status})</span>
                                      </div>
                                  )}
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </div>
            )}
      </div>
  );
}

function DoorClosedIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" />
            <path d="M2 20h20" />
            <path d="M14 12v.01" />
        </svg>
    )
}

function GlobeIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
        </svg>
    )
}