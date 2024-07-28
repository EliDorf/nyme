import React from 'react';
import { useRouter } from 'next/router'

const Layout = ({ children }) => {
  const router = useRouter()
  const isAuthPage = router.pathname === '/sign-in' || router.pathname === '/sign-up'

  return (
    <>
      <header>
        {!isAuthPage && <button>Sign In</button>}
      </header>
      <main>{children}</main>
    </>
  )
}

export default Layout