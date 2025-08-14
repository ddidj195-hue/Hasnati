
import React, { useState, createContext, useContext, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/LoginPage';
import QuranPage from './pages/QuranPage';
import AsmaulHusnaPage from './pages/AsmaulHusnaPage';
import TasbihPage from './pages/TasbihPage';
import DashboardPage from './pages/DashboardPage';
import ProphetsPage from './pages/ProphetsPage';
import ProphetStoryPage from './pages/ProphetStoryPage';
import DuaPage from './pages/DuaPage';
import SplashScreen from './components/SplashScreen';
import QiblaPage from './pages/QiblaPage';
import PrayerTimesPage from './pages/PrayerTimesPage';
import AudioPlayerPage from './pages/AudioPlayerPage';
import DownloadsPage from './pages/DownloadsPage';
import { AudioProvider } from './context/AudioContext';
import { DownloadsProvider } from './context/DownloadsContext';
import AIAssistantPage from './pages/AIAssistantPage';
import { SettingsProvider } from './context/SettingsContext';
import { useSettings } from './hooks/useSettings';
import SettingsPage from './pages/SettingsPage';
import HadithPage from './pages/HadithPage';
import ZakatCalculatorPage from './pages/ZakatCalculatorPage';
import AboutPage from './pages/AboutPage';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// This component now contains all the core logic and is wrapped by providers.
const AppContent: React.FC = () => {
    const { settings } = useSettings();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showSplash, setShowSplash] = useState(true);

    // Integrated Theme Management Logic
    useEffect(() => {
        const root = window.document.documentElement;

        const applyTheme = () => {
            const isDark =
              settings.theme === 'dark' ||
              (settings.theme === 'system' &&
                window.matchMedia('(prefers-color-scheme: dark)').matches);
            
            root.classList.toggle('dark', isDark);
        };
        
        applyTheme();

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = () => {
            if (settings.theme === 'system') {
                applyTheme();
            }
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [settings.theme]);

    // Splash Screen Logic
    useEffect(() => {
        const timer = setTimeout(() => {
          setShowSplash(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);
    
    // Auth Logic
    const authContextValue = useMemo(() => ({
        isAuthenticated,
        login: () => setIsAuthenticated(true),
        logout: () => {
            setIsAuthenticated(false);
            window.location.hash = '/login';
        },
    }), [isAuthenticated]);

    if (showSplash) {
        return <SplashScreen />;
    }

    return (
        <AuthContext.Provider value={authContextValue}>
            <HashRouter>
                <Routes>
                    <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
                    <Route 
                        path="/*"
                        element={
                        isAuthenticated ? (
                            <DownloadsProvider>
                                <AudioProvider>
                                    <MainLayout>
                                        <Routes>
                                            <Route path="/" element={<DashboardPage />} />
                                            <Route path="/quran" element={<QuranPage />} />
                                            <Route path="/asma-ul-husna" element={<AsmaulHusnaPage />} />
                                            <Route path="/prophets" element={<ProphetsPage />} />
                                            <Route path="/prophets/:id" element={<ProphetStoryPage />} />
                                            <Route path="/dua" element={<DuaPage />} />
                                            <Route path="/tasbih" element={<TasbihPage />} />
                                            <Route path="/qibla" element={<QiblaPage />} />
                                            <Route path="/prayer-times" element={<PrayerTimesPage />} />
                                            <Route path="/audio-player" element={<AudioPlayerPage />} />
                                            <Route path="/downloads" element={<DownloadsPage />} />
                                            <Route path="/ai-assistant" element={<AIAssistantPage />} />
                                            <Route path="/hadith" element={<HadithPage />} />
                                            <Route path="/zakat" element={<ZakatCalculatorPage />} />
                                            <Route path="/settings" element={<SettingsPage />} />
                                            <Route path="/about" element={<AboutPage />} />
                                            <Route path="*" element={<Navigate to="/" />} />
                                        </Routes>
                                    </MainLayout>
                                </AudioProvider>
                            </DownloadsProvider>
                        ) : (
                            <Navigate to="/login" />
                        )
                        }
                    />
                </Routes>
            </HashRouter>
        </AuthContext.Provider>
    );
}

// The main App component is now cleaner, only providing the top-level context.
const App: React.FC = () => {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
};

export default App;