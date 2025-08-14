import React, { useState, useEffect, useCallback } from 'react';
import { Coordinates, PrayerTimes } from '../types';
import { calculatePrayerTimes } from '../utils/prayerTimes';
import Spinner from '../components/ui/Spinner';
import { useSettings } from '../hooks/useSettings';

const PrayerTimesPage: React.FC = () => {
    const { settings } = useSettings();
    const [location, setLocation] = useState<Coordinates | null>(null);
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
    const [nextPrayer, setNextPrayer] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const prayerNames: { [key: string]: string } = {
        fajr: 'الفجر',
        sunrise: 'الشروق',
        dhuhr: 'الظهر',
        asr: 'العصر',
        maghrib: 'المغرب',
        isha: 'العشاء',
    };

    const findNextPrayer = (times: PrayerTimes) => {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        for (const key in times) {
            if (key in prayerNames && key !== 'sunrise') {
                const [h, m] = times[key].split(':').map(Number);
                const prayerTime = h * 60 + m;
                if (prayerTime > currentTime) {
                    return key;
                }
            }
        }
        return 'fajr'; // If all prayers have passed, next is Fajr of the next day
    };

    const getLocationAndCalcTimes = useCallback(() => {
        setIsLoading(true);
        setError(null);
        
        const processLocation = (coords: Coordinates) => {
            setLocation(coords);
            const times = calculatePrayerTimes(coords.latitude, coords.longitude, settings.prayerMethod);
            setPrayerTimes(times);
            setNextPrayer(findNextPrayer(times));
            setIsLoading(false);
        };

        const savedLocation = localStorage.getItem('userLocation');
        if (savedLocation) {
            processLocation(JSON.parse(savedLocation));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude };
                localStorage.setItem('userLocation', JSON.stringify(userLocation));
                processLocation(userLocation);
            },
            () => {
                setError('تعذر الوصول إلى موقعك. يرجى تفعيل خدمة تحديد المواقع في جهازك والموافقة على الإذن.');
                setIsLoading(false);
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    }, [settings.prayerMethod]);

    useEffect(() => {
        getLocationAndCalcTimes();
    }, [getLocationAndCalcTimes]);
    
    useEffect(() => {
        const interval = setInterval(() => {
            if (prayerTimes) {
                setNextPrayer(findNextPrayer(prayerTimes));
            }
        }, 60000);
        return () => clearInterval(interval);
    }, [prayerTimes]);


    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <Spinner />
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">جاري حساب مواقيت الصلاة...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg">
                <i className="ph-fill ph-warning-circle text-6xl text-black dark:text-white mb-4"></i>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">حدث خطأ</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                <button
                  onClick={getLocationAndCalcTimes}
                  className="bg-black text-white dark:bg-white dark:text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  المحاولة مرة أخرى
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 animate-fade-in">
            <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                <h2 className="text-4xl font-bold text-black dark:text-white">مواقيت الصلاة</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                    {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>
            {prayerTimes && (
                <div className="space-y-4">
                    {Object.keys(prayerNames).map((key) => (
                        <div key={key} className={`flex justify-between items-center p-4 rounded-lg transition-all duration-300 ${nextPrayer === key ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg scale-105' : 'bg-gray-100 dark:bg-gray-800'}`}>
                            <div className="flex items-center">
                                <i className={`ph-fill ph-${key === 'sunrise' ? 'sun' : 'moon'} text-2xl mr-4 ${nextPrayer === key ? 'text-white dark:text-black' : 'text-gray-500'}`}></i>
                                <span className={`font-bold text-lg ${nextPrayer === key ? 'text-white dark:text-black' : 'text-gray-800 dark:text-gray-200'}`}>{prayerNames[key]}</span>
                            </div>
                            <span className={`font-mono text-2xl font-semibold ${nextPrayer === key ? 'text-gray-200 dark:text-gray-800' : 'text-gray-700 dark:text-gray-300'}`}>
                                {prayerTimes[key]}
                            </span>
                        </div>
                    ))}
                </div>
            )}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default PrayerTimesPage;