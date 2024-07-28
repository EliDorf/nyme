import { Dashboard } from '@/components/component/Dashboard';
import React from 'react';
import { NewSidebar } from '@/components/shared/new-sidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-col md:flex-row min-h-screen">
      <NewSidebar className="w-full md:w-64 lg:w-72 flex-shrink-0" />
      <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <Dashboard />
        {children}
      </div>
    </main>
  );
}

export default Layout;