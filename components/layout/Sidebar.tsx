import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../App';

interface NavItemType {
  path: string;
  name: string;
  icon: string;
  online?: boolean;
}

const navItems: NavItemType[] = [
  { path: '/', name: 'الرئيسية', icon: 'house' },
  { path: '/quran', name: 'القرآن الكريم', icon: 'book-open' },
  { path: '/audio-player', name: 'مشغل القرآن', icon: 'speaker-high' },
  { path: '/hadith', name: 'مكتبة الحديث', icon: 'book-bookmark' },
  { path: '/dua', name: 'حصن المسلم', icon: 'shield-check' },
  { path: '/prophets', name: 'قصص الأنبياء', icon: 'scroll' },
  { path: '/asma-ul-husna', name: 'أسماء الله الحسنى', icon: 'sparkle' },
  { path: '/tasbih', name: 'التسبيح', icon: 'hand-praying' },
  { path: '/prayer-times', name: 'مواقيت الصلاة', icon: 'clock' },
  { path: '/qibla', name: 'اتجاه القبلة', icon: 'compass' },
  { path: '/zakat', name: 'حاسبة الزكاة', icon: 'coins' },
  { path: '/ai-assistant', name: 'الرفيق الإيماني', icon: 'brain', online: true },
  { path: '/downloads', name: 'المكتبة', icon: 'download-simple' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const location = useLocation();
  
  const NavItem: React.FC<{item: NavItemType}> = ({ item }) => {
    const isActive = location.pathname.startsWith(item.path) && (item.path !== '/' || location.pathname === '/');

    return (
      <NavLink
        to={item.path}
        onClick={onClose} // Close sidebar on navigation in mobile view
        className={`flex items-center justify-end p-3 my-1 rounded-lg transition-colors duration-200 ${
          isActive
            ? 'bg-gray-200 text-black dark:bg-gray-800 dark:text-white'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        <div className="flex items-center">
            {item.online && <span className="text-xs bg-gray-700 text-white dark:bg-gray-300 dark:text-black rounded-full px-2 py-0.5 ml-2 font-mono">Online</span>}
            <span className="font-bold mr-4">{item.name}</span>
        </div>
        <i className={`ph-fill ph-${item.icon} text-2xl ml-auto`}></i>
      </NavLink>
    );
  };

  return (
    <aside 
      className={`fixed inset-y-0 right-0 z-50 w-72 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-l border-gray-200 dark:border-gray-700 p-4 flex flex-col h-screen transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      dir="rtl"
    >
      <div className="flex items-center justify-between text-center py-6">
        <div className="flex-grow">
          <h1 className="text-3xl font-bold text-black dark:text-white">حسناتي</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Hasanati</p>
        </div>
        <button onClick={onClose} className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="إغلاق القائمة">
          <i className="ph-fill ph-x text-2xl text-gray-600 dark:text-gray-300"></i>
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto">
        {navItems.map((item) => <NavItem key={item.path} item={item} />)}
      </nav>

      {/* Settings and Logout */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
         <NavLink
            to="/about"
            onClick={onClose}
            className={({ isActive }) => `flex items-center justify-end p-3 my-1 rounded-lg transition-colors duration-200 ${
              isActive
                ? 'bg-gray-200 text-black dark:bg-gray-800 dark:text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="font-bold mr-4">عن المطور</span>
            <i className="ph-fill ph-info text-2xl"></i>
          </NavLink>
         <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) => `flex items-center justify-end p-3 my-1 rounded-lg transition-colors duration-200 ${
              isActive
                ? 'bg-gray-200 text-black dark:bg-gray-800 dark:text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="font-bold mr-4">الإعدادات</span>
            <i className="ph-fill ph-gear text-2xl"></i>
          </NavLink>
        <button
          onClick={logout}
          className="w-full flex items-center justify-end p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white transition-colors duration-200"
        >
          <span className="font-bold mr-4">تسجيل الخروج</span>
          <i className="ph-fill ph-sign-out text-2xl"></i>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;