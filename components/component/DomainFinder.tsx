// DomainFinder.tsx
import React, { useMemo, useState } from 'react';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from 'axios';

interface Domain {
    domain: string;
    available: boolean;
  }
  
  export function DomainFinder() {
    const [domains, setDomains] = useState<Domain[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    // Placeholder data
    const placeholderDomains: Domain[] = [
      { domain: 'Namye.com', available: true },
      { domain: 'Nyme.io', available: false },
      { domain: 'Nyme.ai', available: true },
      { domain: 'Namin.com', available: false },
      { domain: 'Amin.co', available: true },
      { domain: 'Nyme.com', available: false },
      { domain: 'Namye.net', available: true },
      { domain: 'Names.com', available: false },
      { domain: 'Nyme.co', available: false },
    ];
  
    const displayDomains = domains.length > 0 ? domains : placeholderDomains;
    const availableDomains = displayDomains.filter(d => d.available);
    const unavailableDomains = displayDomains.filter(d => !d.available);
  
    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-5 md:grid-cols-5 gap-2">
          {['.com', '.io', '.ai', '.co', '.net'].map((domain) => (
            <Button
              key={domain}
              variant="outline"
              className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {domain}
            </Button>
          ))}
        </div>
        <div className="border rounded-lg overflow-auto shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="py-2 px-4 bg-gray-100 dark:bg-gray-800">Available Domains</TableHead>
                <TableHead className="py-2 px-4 bg-gray-100 dark:bg-gray-800">Not Available</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: Math.max(availableDomains.length, unavailableDomains.length) }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="py-2 px-4">
                    {availableDomains[index] && (
                      <div className="flex items-center gap-2">
                        <GlobeIcon className="w-4 h-4 shrink-0 text-green-500" />
                        <span>{availableDomains[index].domain}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-2 px-4">
                    {unavailableDomains[index] && (
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <DoorClosedIcon className="w-4 h-4 shrink-0 text-red-500" />
                        <span>{unavailableDomains[index].domain}</span>
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
  