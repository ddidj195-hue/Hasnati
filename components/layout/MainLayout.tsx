import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import GlobalAudioPlayer from '../audio/GlobalAudioPlayer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-gray-100 min-h-screen flex" dir="rtl">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24"> {/* Removed overflow-y-auto for natural page scroll */}
          {children}
        </main>
        <GlobalAudioPlayer />
      </div>
    </div>
  );
};

export default MainLayout;