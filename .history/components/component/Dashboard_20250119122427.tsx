'use client'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import React, { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useUser } from '@clerk/nextjs'
import { creditFee } from "@/constants"
import { InsufficientCreditsModal } from "../shared/InsufficientCreditsModal"
import { useSuggestions } from "./UseSuggestion"
import { updateCredits } from "@/lib/actions/user.action"
import { useUserData } from "@/lib/actions/useUserData"
import { User } from '@/types/user';
import { DomainFinder } from './DomainFinder';

export function Dashboard() {
  const { user } = useUser();
  const { userData, refetchUserData } = useUserData();
  const { suggestions, isLoading, error, handleSubmit } = useSuggestions();
  const [input, setInput] = useState("");
  const [shouldCheckDomains, setShouldCheckDomains] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (user && userData) {
      try {
        handleSubmit(input);
        // Make sure userData._id is the MongoDB ObjectId
        await updateCredits(userData._id.toString(), creditFee);
        await refetchUserData(); // Refetch user data after credits are updated
        setShouldCheckDomains(true);
      } catch (error) {
        console.error("Error in onSubmit:", error);
        // Handle the error appropriately (e.g., show an error message to the user)
      }
    }
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 w-full max-w-6xl mx-auto dashboard-content">
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="font-medium">
            Enter a creative name or keyword
          </Label>
          <Input
            id="name"
            value={input}
            onChange={handleInputChange}
            placeholder="Type something awesome..."
            className="rounded-lg border-gray-300 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <Button onClick={onSubmit} className="w-full">Submit</Button>
        <p className="text-sm text-gray-500 text-center">Credits remaining: {userData?.creditBalance || 0}</p>
        {userData && userData.creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal />}
        <div className="border rounded-lg overflow-hidden shadow-md">
          <div className="bg-gray-100 dark:bg-gray-800 py-2 px-4 font-medium">
            Suggestions
          </div>
          <div className="divide-y">
            {isLoading ? (
              <div className="py-2 px-4">Loading...</div>
            ) : error ? (
              <div className="py-2 px-4 text-red-500">{error}</div>
            ) : (
              suggestions.map((suggestion, index) => (
                <div key={index} className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <div className="flex items-center gap-2">
                    <SparkleIcon className="w-4 h-4 shrink-0 text-primary-500" />
                    <span>{suggestion}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <DomainFinder 
        inputDomain={input} 
        suggestions={suggestions} 
        shouldCheckDomains={shouldCheckDomains} 
      />
    </div>
  )
}


function SparkleIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  )
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