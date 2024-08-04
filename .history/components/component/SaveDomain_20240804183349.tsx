import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { useUser } from '@clerk/nextjs';

interface Domain {
  domain: string;
  status: {
    status: string;
    zone: string;
    summary: string;
  };
}

interface SaveDomainButtonProps {
  availableDomains: Domain[];
  unavailableDomains: Domain[];
  inputDomain: string;
}

export function SaveDomainButton({ availableDomains, unavailableDomains, inputDomain }: SaveDomainButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const saveDomains = async () => {
    console.log("saveDomains function called");
    if (!user) {
      console.log("No user found, cannot save domains");
      setError('You must be logged in to save domains');
      return;
    }

    setIsSaving(true);
    try {
      const domainsToSave = [...availableDomains, ...unavailableDomains];
      console.log("Domains to save:", domainsToSave);
      console.log("User ID:", user.id);
      console.log("Input domain:", inputDomain);

      const response = await axios.post('/api/save-domains', {
        domains: domainsToSave,
        userId: user.id,
        input: inputDomain
      });
      
      console.log("API response:", response);

      if (response.status === 200) {
        console.log("Domains saved successfully");
        alert('Domains saved successfully!');
      } else {
        console.log("Unexpected response status:", response.status);
        throw new Error('Failed to save domains');
      }
    } catch (error) {
      console.error('Error saving domains:', error);
      setError('Failed to save domains. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <Button 
        onClick={saveDomains} 
        disabled={isSaving || (availableDomains.length + unavailableDomains.length) === 0}
        className="mt-4"
      >
        {isSaving ? 'Saving...' : 'Save Domains'}
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}