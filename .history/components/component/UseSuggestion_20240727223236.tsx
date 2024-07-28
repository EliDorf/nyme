// useSuggestions.ts
import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { creditFee } from "@/constants"

const PLACEHOLDER_SUGGESTIONS = [
  "Names",
  "Nyme",
  "Namin",
  "Amin",
  "Namye"
];
async function updateCreditsWithClerkId(clerkId: string, creditFee: number) {
  const user = await User.findOne({ clerkId });
  if (!user) {
    throw new Error("User not found");
  }
  return updateCredits(user._id.toString(), creditFee);
}
export function useSuggestions() {
  const [suggestions, setSuggestions] = useState<string[]>(PLACEHOLDER_SUGGESTIONS)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()

  const handleSubmit = async (input: string) => {
    setIsLoading(true)
    setError(null)
    // Note: You'll need to implement updateCredits function or move it to this file
    // await updateCredits(userId, creditFee)
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          input,
          userId: user?.id || 'anonymous'
        }),
      })
  
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
  
      const data = await response.json()
      console.log("Raw data from API:", data)
      console.log("Received suggestions:", data.suggestions)
  
      const newSuggestions = Array.isArray(data.suggestions) ? data.suggestions : PLACEHOLDER_SUGGESTIONS
      console.log("Setting suggestions to:", newSuggestions)
  
      setSuggestions(newSuggestions)
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to fetch suggestions. Please try again.')
      setSuggestions(PLACEHOLDER_SUGGESTIONS)
    } finally {
      setIsLoading(false)
    }
  }

  return { suggestions, isLoading, error, handleSubmit }
}