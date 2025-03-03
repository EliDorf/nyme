'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { creditFee } from '../../constants'
import { 
  trackDomainSearchError,
  trackAiFeedback,
  trackCreditUsed
} from '../../lib/analytics/dataLayer'

const PLACEHOLDER_SUGGESTIONS = [
  "Names",
  "Nyme",
  "Namin",
  "Amin",
  "Namye"
];

export type SuggestionMode = 'short' | 'synonym';

export function useSuggestions() {
  const [suggestions, setSuggestions] = useState<string[]>(PLACEHOLDER_SUGGESTIONS)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<SuggestionMode>('short')
  const { user } = useUser()

  const handleSubmit = async (input: string, suggestionMode: SuggestionMode = 'short') => {
    setIsLoading(true)
    setError(null)
    setMode(suggestionMode)
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          input,
          userId: user?.id || 'anonymous',
          mode: suggestionMode
        }),
      })
  
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
  
      const data = await response.json()
      const newSuggestions = Array.isArray(data.suggestions) ? data.suggestions : PLACEHOLDER_SUGGESTIONS
      setSuggestions(newSuggestions)

      // Track credit usage and successful AI suggestions
      trackCreditUsed('name_suggestion', creditFee)
      trackAiFeedback(input, 'thumbs_up', 'Suggestions generated successfully')
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = 'Failed to fetch suggestions. Please try again.'
      setError(errorMessage)
      setSuggestions(PLACEHOLDER_SUGGESTIONS)

      // Track AI suggestion error
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      trackDomainSearchError('AI_ERROR', errorMessage, userEmail)
      trackAiFeedback(input, 'thumbs_down', 'Failed to generate suggestions')
    } finally {
      setIsLoading(false)
    }
  }

  return { suggestions, isLoading, error, handleSubmit, mode, setMode }
}
