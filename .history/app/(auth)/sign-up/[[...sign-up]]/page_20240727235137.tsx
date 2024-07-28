import { SignUp } from '@clerk/nextjs'
import Head from 'next/head'
import React from 'react'

const SignUpPage = () => {
  return (
    <>
      <Head>
        <title>Sign Up - Nyme.ai</title>
      </Head>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
        <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-center text-gray-700">Welcome to Nyme.ai</h1>
          <SignUp />
        </div>
      </div>
    </>
  )
}

export default SignUpPage