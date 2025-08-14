import React from 'react';
import { useLocation } from 'react-router-dom';

const pageTitles: { [key: string]: string } = {
  '/': 'لوحة التحكم',
  '/quran': 'القرآن الكريم',
  '/asma-ul-husna': 'أسماء الله الحسنى',
  '/prophets': 'قصص الأنبياء',
  '/dua': 'حصن المسلم',
  '/tasbih': 'المسبحة الإلكترونية',
  '/qibla': 'اتجاه القبلة',
  '/prayer-times': 'مواقيت الصلاة',
  '/audio-player': 'مشغل القرآن',
  '/downloads': 'المكتبة',
  '/ai-assistant': 'الرفيق الإيماني',
  '/settings': 'الإعدادات',
  '/hadith': 'مكتبة الحديث',
  '/zakat': 'حاسبة الزكاة',
  '/about': 'عن المطور',
};

const onlinePages = ['/ai-assistant'];

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const location = useLocation();

  const getTitle = (pathname: string): string => {
    if (pathname.startsWith('/prophets/')) {
        return pageTitles['/prophets'];
    }
    return pageTitles[pathname] || 'Hasanati';
  }

  const title = getTitle(location.pathname);
  const isOnlinePage = onlinePages.includes(location.pathname);

  return (
    <header className="bg-white/60 dark:bg-black/60 backdrop-blur-sm sticky top-0 z-20 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
       <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick} 
          className="md:hidden p-2 -ml-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="افتح القائمة"
        >
          <i className="ph-fill ph-list text-2xl"></i>
        </button>
        <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white">{title}</h2>
            {isOnlinePage && (
              <div className="bg-gray-200 text-black text-xs font-bold px-2.5 py-1 rounded-full dark:bg-gray-700 dark:text-white flex items-center gap-1">
                <i className="ph-fill ph-wifi-high"></i>
                <span>ONLINE</span>
              </div>
            )}
        </div>
       </div>
       {/* ThemeToggle is removed as it's now in Settings */}
    </header>
  );
};

export default Header;