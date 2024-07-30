import { Dashboard } from '@/components/component/Dashboard';
import React from 'react';
import { NewSidebar } from '@/components/shared/new-sidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex h-screen bg-background">
      <NewSidebar/>
      <div className="flex-1 overflow-y-auto p-4">
        <Dashboard />
        {children}
      </div>
    </main>
  );
}

export default Layout;