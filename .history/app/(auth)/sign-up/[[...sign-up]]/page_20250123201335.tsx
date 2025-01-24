import { SignUp } from '@clerk/nextjs'
import Head from 'next/head'
import React from 'react'

const SignUpPage = () => {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 dark:from-slate-900 dark:to-slate-800">
        <div className="w-full max-w-md p-8 space-y-4 bg-white dark:bg-slate-900 rounded-xl shadow-lg dark:shadow-2xl dark:shadow-slate-900/50">
          <h1 className="text-2xl font-bold text-center text-gray-700 dark:text-gray-100">Welcome to Nyme.ai</h1>
          <SignUp />
        </div>
      </div>
    </>
  )
}

export default SignUpPage
