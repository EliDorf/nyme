import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="auth">
      <style jsx global>{`
        header {
          display: none;
        }
      `}</style>
      {children}
    </main>
  );
}

export default Layout;