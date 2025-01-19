import React from 'react';
import { DomainFinder } from './DomainFinder';

interface DashboardProps {
  inputDomain: string;
  suggestions: string[];
  shouldCheckDomains: boolean;
}

export function Dashboard({ inputDomain, suggestions, shouldCheckDomains }: DashboardProps) {
  return (
    <div className="w-full">
      <DomainFinder 
        inputDomain={inputDomain}
        suggestions={suggestions}
        shouldCheckDomains={shouldCheckDomains}
      />
    </div>
  );
}
