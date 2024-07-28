import { Dashboard } from '@/components/component/Dashboard';
import React from 'react';
import { NewSidebar } from '@/components/shared/new-sidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="root">
      <NewSidebar />
        <div className='root-container'>
            <div className='wrapper'>
              <Dashboard/>
            {children}
            </div>
        </div>
    </main>
  );
}

export default Layout;
