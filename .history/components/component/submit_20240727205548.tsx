'use client'

import React, { useState } from "react"
import { useUser } from '@clerk/nextjs'
import { creditFee } from "@/constants"
import { InsufficientCreditsModal } from "../shared/InsufficientCreditsModal"

const PLACEHOLDER_SUGGESTIONS = [
    "Names",
    "Nyme",
    "Namin",
    "Amin",
    "Namye"
  ];
  
  export function Dashboard() {
    const [input, setInput] = useState("")
    const [suggestions, setSuggestions] = useState<string[]>(PLACEHOLDER_SUGGESTIONS)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { user } = useUser()
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value)
    }
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            input,
            userId: user?.id || 'anonymous' // Include the userId here
          }),
        })
    
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
    
        const data = await response.json()
        console.log("Raw data from API:", data)  // Log the raw data here
        console.log("Received suggestions:", data.suggestions)  // Log the suggestions
    
        // Ensure suggestions is always an array
        const newSuggestions = Array.isArray(data.suggestions) ? data.suggestions : PLACEHOLDER_SUGGESTIONS
        console.log("Setting suggestions to:", newSuggestions)  // Log what we're setting
    
        setSuggestions(newSuggestions)
      } catch (error) {
        console.error('Error:', error)
        setError('Failed to fetch suggestions. Please try again.')
        setSuggestions(PLACEHOLDER_SUGGESTIONS)  // Use PLACEHOLDER_SUGGESTIONS directly here
      } finally {
        setIsLoading(false)
      }