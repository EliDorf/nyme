import { Dashboard } from '@/components/component/Dashboard';
import React from 'react';
import { NewSidebar } from '@/components/shared/new-sidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-col md:flex-row min-h-screen">
      <NewSidebar/>
      <div className="flex-grow p-4 md:p-8 overflow-x-hidden">
        <Dashboard />
        {children}
      </div>
    </main>
  );
}

export default Layout;