import React, { useState, useEffect, useCallback } from 'react';
import { Coordinates } from '../types';
import Spinner from '../components/ui/Spinner';

const QiblaPage: React.FC = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(true);

  const kaabaCoords: Coordinates = { latitude: 21.422487, longitude: 39.826206 };

  const calculateQibla = useCallback((coords: Coordinates) => {
    const lat1 = coords.latitude * (Math.PI / 180);
    const lon1 = coords.longitude * (Math.PI / 180);
    const lat2 = kaabaCoords.latitude * (Math.PI / 180);
    const lon2 = kaabaCoords.longitude * (Math.PI / 180);

    const y = Math.sin(lon2 - lon1);
    const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(lon2 - lon1);
    
    let brng = Math.atan2(y, x);
    brng = brng * (180 / Math.PI);
    brng = (brng + 360) % 360;
    
    setQiblaDirection(brng);
  }, [kaabaCoords]);


  const requestPermissions = () => {
    setError(null);
    setIsLocating(true);

    // Request location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userLocation = { latitude, longitude };
        setLocation(userLocation);
        calculateQibla(userLocation);
        setIsLocating(false);
      },
      (err) => {
        setError('تعذر الوصول إلى موقعك. يرجى تفعيل خدمة تحديد المواقع في جهازك والموافقة على الإذن.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    // Request orientation permission (for iOS 13+)
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          } else {
             setError('لعمل البوصلة، يرجى تفعيل إذن الوصول إلى حساسات الحركة في إعدادات المتصفح.');
          }
        })
        .catch(console.error);
    } else {
      // For non-iOS 13+ devices
      window.addEventListener('deviceorientation', handleOrientation);
    }
  };

  useEffect(() => {
    requestPermissions();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [calculateQibla]);

  const handleOrientation = (event: DeviceOrientationEvent) => {
    // webkitCompassHeading is for iOS
    const compass = (event as any).webkitCompassHeading || Math.abs((event.alpha || 0) - 360);
    setHeading(compass);
  };
  
  const compassRotation = heading !== null ? 360 - heading : 0;
  const qiblaRotation = heading !== null ? qiblaDirection - heading : 0;

  if (isLocating) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <Spinner />
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">جاري تحديد موقعك...</p>
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
              onClick={requestPermissions}
              className="bg-black text-white dark:bg-white dark:text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              المحاولة مرة أخرى
            </button>
        </div>
    );
  }


  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-12 w-full max-w-md relative">
        <h2 className="text-3xl font-bold text-black dark:text-white mb-2">اتجاه القبلة</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
            {qiblaDirection.toFixed(2)}° باتجاه الشمال
        </p>

        {/* Compass */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto">
          <div 
            className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full transition-transform duration-200"
            style={{ transform: `rotate(${compassRotation}deg)` }}
          >
            {/* Compass markings */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 text-lg font-bold text-black dark:text-white">N</div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -mb-4 text-lg font-bold">S</div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 -mr-4 text-lg font-bold">E</div>
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -ml-4 text-lg font-bold">W</div>
            <div className="w-full h-full border-[10px] border-white dark:border-gray-900 rounded-full"></div>
          </div>
          
           {/* Qibla Arrow */}
           {heading !== null ? (
               <div
                  className="absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out"
                  style={{ transform: `rotate(${qiblaRotation}deg)` }}
                >
                    <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-0 h-0 
                        border-l-[15px] border-l-transparent
                        border-r-[15px] border-r-transparent
                        border-b-[30px] border-b-black dark:border-b-white">
                    </div>
                </div>
           ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full backdrop-blur-sm">
                   <div className="text-center text-white">
                        <i className="ph-fill ph-compass text-4xl animate-pulse"></i>
                        <p className="mt-2 font-semibold">قم بتحريك جهازك للمعايرة</p>
                   </div>
                </div>
           )}

            {/* Center point */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-black dark:bg-white rounded-full border-2 border-white dark:border-gray-900"></div>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-8">
            قد تحتاج أجهزة iOS إلى تفعيل "Motion & Orientation Access" في إعدادات Safari.
        </p>
      </div>
    </div>
  );
};

export default QiblaPage;