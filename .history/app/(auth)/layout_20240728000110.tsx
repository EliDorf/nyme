import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <style jsx global>{`
        body.auth header {
          display: none;
        }
      `}</style>
      <main className="auth">{children}</main>
    </>
  );
}

export default Layout;