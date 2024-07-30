// DomainFinder.tsx
import React from 'react';
import { Button } from './Button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from './Table';
import { GlobeIcon, DoorClosedIcon } from './Icons';

interface DomainFinderProps {
  // Add any props you need to pass to this component
}

export function DomainFinder({}: DomainFinderProps) {
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
            {/* Table rows here */}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}