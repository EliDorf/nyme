import { SignIn } from '@clerk/nextjs'
import React from 'react'

const SignInPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md p-8 space-y-4 bg-transparent rounded-xl shadow-lg dark:shadow-2xl dark:shadow-slate-900/50">
        <h1 className="text-2xl font-bold text-center text-gray-700 dark:text-gray-100">Welcome to Nyme.ai</h1>
        <SignIn 
          appearance={{
            elements: {
              rootBox: "bg-transparent",
              card: "bg-white dark:bg-slate-900 shadow-none",
              formButtonPrimary: 
                'bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white text-sm normal-case',
              footerActionLink: 'text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300'
            },
          }}
        />
      </div>
    </div>
  )
}

export default SignInPage
