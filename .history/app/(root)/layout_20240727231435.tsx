import { Dashboard } from '@/components/component/Dashboard';
import React from 'react';
import { NewSidebar } from '@/components/shared/new-sidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex">
      <NewSidebar />
      <div className="flex-1 p-8">
        <Dashboard />
        {children}
      </div>
    </main>
  );
}

export default Layout;