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
      <Button
        variant="outline"
        className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        .com
      </Button>
      <Button
        variant="outline"
        className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        .io
      </Button>
      <Button
        variant="outline"
        className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        .ai
      </Button>
      <Button
        variant="outline"
        className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        .co
      </Button>
      <Button
        variant="outline"
        className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        .net
      </Button>
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
          <TableRow>
            <TableCell className="py-2 px-4">
              <div className="flex items-center gap-2">
                <GlobeIcon className="w-4 h-4 shrink-0 text-green-500" />
                <span>creativestudio.com</span>
              </div>
            </TableCell>
            <TableCell className="py-2 px-4">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <DoorClosedIcon className="w-4 h-4 shrink-0 text-red-500" />
                <span>creativestudio.io</span>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="py-2 px-4">
              <div className="flex items-center gap-2">
                <GlobeIcon className="w-4 h-4 shrink-0 text-green-500" />
                <span>creativestudio.ai</span>
              </div>
            </TableCell>
            <TableCell className="py-2 px-4">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <DoorClosedIcon className="w-4 h-4 shrink-0 text-red-500" />
                <span>creativestudio123.com</span>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="py-2 px-4">
              <div className="flex items-center gap-2">
                <GlobeIcon className="w-4 h-4 shrink-0 text-green-500" />
                <span>creativestudio.co</span>
              </div>
            </TableCell>
            <TableCell className="py-2 px-4">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <DoorClosedIcon className="w-4 h-4 shrink-0 text-red-500" />
                <span>creativestudioco.com</span>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="py-2 px-4">
              <div className="flex items-center gap-2">
                <GlobeIcon className="w-4 h-4 shrink-0 text-green-500" />
                <span>creativestudio.net</span>
              </div>
            </TableCell>
            <TableCell className="py-2 px-4">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <DoorClosedIcon className="w-4 h-4 shrink-0 text-red-500" />
                <span>creativestudioinc.com</span>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="py-2 px-4" />
            <TableCell className="py-2 px-4">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <DoorClosedIcon className="w-4 h-4 shrink-0 text-red-500" />
                <span>creativestudiodesign.com</span>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
  );
}