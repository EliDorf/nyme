import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from 'axios';

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
}

const TLDs = ['.com', '.io', '.ai', '.co', '.net'];

export function DomainFinder({ inputDomain, suggestions }: DomainFinderProps) {
    const [domains, setDomains] = useState<Domain[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    // Placeholder data generator using suggestions
    const generatePlaceholderDomains = (suggestions: string[]): Domain[] => {
        const placeholders: Domain[] = [];
        const statuses = ['inactive', 'active'];
        suggestions.forEach((suggestion, index) => {
            TLDs.forEach((tld, tldIndex) => {
                if (placeholders.length < 10) {
                    const domain = `${suggestion}${tld}`;
                    const status = statuses[(index + tldIndex) % 2]; // Alternating status
                    placeholders.push({
                        domain,
                        status: { domain, zone: tld.slice(1), status, summary: status }
                    });
                }
            });
        });
        return placeholders;
    };

    useEffect(() => {
        if (inputDomain) {
            checkDomains(inputDomain);
        }
    }, [inputDomain]);


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


    const placeholderDomains = generatePlaceholderDomains(suggestions);
    const displayDomains = hasSearched ? domains : placeholderDomains;
    const availableDomains = displayDomains.filter(d => isAvailable(d.status.status));
    const unavailableDomains = displayDomains.filter(d => !isAvailable(d.status.status));

    return (
        <div className="flex flex-col gap-4">
            {isLoading && <p>Checking domain availability...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div className="border rounded-lg overflow-auto shadow-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="py-2 px-4 bg-gray-100 dark:bg-gray-800">Available Domains</TableHead>
                            <TableHead className="py-2 px-4 bg-gray-100 dark:bg-gray-800">
                                Not Available ({unavailableDomains.length} domains)
                                {!hasSearched && (
                                    <span className="text-xs text-gray-500">
                                        {` (Placeholder data: ${unavailableDomains.length} domain${unavailableDomains.length !== 1 ? 's' : ''})`}
                                    </span>
                                )}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: Math.max(availableDomains.length, Math.min(unavailableDomains.length, 10)) }).map((_, index) => (
                            <TableRow key={index}>
                                <TableCell className="py-2 px-4">
                                    {availableDomains[index] && (
                                        <div className="flex items-center gap-2">
                                            <GlobeIcon className="w-4 h-4 shrink-0 text-green-500" />
                                            <span>{availableDomains[index].domain}</span>
                                            <span className="text-xs text-gray-500">({availableDomains[index].status.status})</span>
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="py-2 px-4">
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