import { SignUp } from '@clerk/nextjs'
import React from 'react'

const SignUpPage = () => {
  return (
    
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-700">Welcome to Nyme.ai</h1>
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 
                'bg-purple-500 hover:bg-purple-600 text-sm normal-case',
              footerActionLink: 'text-purple-600 hover:text-purple-700'
            },
          }}
        />
      </div>
    </div>
  )
}

export default SignUpPage