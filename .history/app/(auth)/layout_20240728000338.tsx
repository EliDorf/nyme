import React from 'react';
import './auth-layout.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="auth-layout">{children}</main>
  );
}

export default Layout;