import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="auth-layout">{children}</main>
  );
}

export default Layout;