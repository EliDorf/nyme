import { Dashboard } from '@/components/component/Dashboard';
import { Sidebar } from '@/components/shared/Sidebar';
import React from 'react';
import { MobileNav } from '@/components/shared/mobile-nav';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="root">
      <Sidebar />
      //<MobileNav />
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
