import { Dashboard } from '@/components/component/Dashboard';
import { Sidebar } from '@/components/shared/Sidebar';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="root">
      <Sidebar />
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
