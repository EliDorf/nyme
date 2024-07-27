import React, { useState } from "react"

export function Dashboard() {
  const [input, setInput] = useState("")
  const [suggestions, setSuggestions] = useState([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()


        }
  }
}