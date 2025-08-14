// This is a simplified prayer times calculation library.
// It's based on well-known algorithms and doesn't require external dependencies.

// Calculation Methods
const methods: { [key: string]: { fajr: number; isha: number | string } } = {
    MWL: { // Muslim World League
        fajr: 18,
        isha: 17,
    },
    ISNA: { // Islamic Society of North America
        fajr: 15,
        isha: 15,
    },
    Egyptian: { // Egyptian General Authority of Survey
        fajr: 19.5,
        isha: 17.5,
    },
    Makkah: { // Umm al-Qura University, Makkah
        fajr: 18.5,
        isha: '90 min', // 90 minutes after Maghrib
    },
    Karachi: { // University of Islamic Sciences, Karachi
        fajr: 18,
        isha: 18,
    },
};

const prayerTimesInternal = (
    latitude: number,
    longitude: number,
    timezone: number,
    date: Date,
    method: { fajr: number; isha: number | string }
) => {
    const toRadians = (d: number) => (d * Math.PI) / 180;
    const toDegrees = (r: number) => (r * 180) / Math.PI;

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const JD =
        Math.floor(365.25 * (year + 4716)) +
        Math.floor(30.6001 * (month + 1)) +
        day - 1524.5;
    
    const G = (JD - 2451545.0) / 36525;
    const L = (280.46646 + G * (36000.76983 + G * 0.0003032)) % 360;
    const M = (357.52911 + G * (35999.05029 - G * 0.0001537)) % 360;
    const e = 0.016708634 - G * (0.000042037 + G * 0.0000001267);

    const C = (1.914602 - G * (0.004817 + G * 0.000014)) * Math.sin(toRadians(M))
             + (0.019993 - G * 0.000101) * Math.sin(toRadians(2*M))
             + 0.000289 * Math.sin(toRadians(3*M));

    const true_lon = L + C;
    const obli_ecl = (23.439291 - G * (0.0130042 + G * (0.000000163 - G * 0.000000503))) % 360;
    const sun_app_lon = true_lon - 0.00569 - 0.00478 * Math.sin(toRadians(125.04 - 1934.136 * G));
    
    const declination = toDegrees(Math.asin(Math.sin(toRadians(obli_ecl)) * Math.sin(toRadians(sun_app_lon))));

    const equationOfTime = 4 * toDegrees(Math.atan2(Math.tan(toRadians(obli_ecl/2))**2 * Math.sin(toRadians(2*L)),1) - (L - M)/360 - e * Math.sin(toRadians(M)) / (Math.PI/180) );

    const getHourAngle = (angle: number) => {
      return toDegrees(Math.acos(
          (Math.sin(toRadians(angle)) - Math.sin(toRadians(latitude)) * Math.sin(toRadians(declination))) /
          (Math.cos(toRadians(latitude)) * Math.cos(toRadians(declination)))
      ));
    }
    
    const noon = (720 - 4 * longitude - equationOfTime + timezone * 60) / 60;

    const Fajr = noon - getHourAngle(method.fajr) / 15;
    const Sunrise = noon - getHourAngle(-0.833) / 15;
    const Asr = noon + getHourAngle(toDegrees(Math.atan(1 / (1 + Math.tan(toRadians(Math.abs(latitude - declination))))))) / 15;
    const Maghrib = noon + getHourAngle(-0.833) / 15;
    const Isha = typeof method.isha === 'number' ? noon + getHourAngle(method.isha) / 15 : Maghrib + 1.5; // For '90 min'

    const formatTime = (time: number) => {
        if (isNaN(time)) return '-----';
        const hours = Math.floor(time);
        const minutes = Math.floor((time - hours) * 60);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };
    
    return {
        fajr: formatTime(Fajr),
        sunrise: formatTime(Sunrise),
        dhuhr: formatTime(noon),
        asr: formatTime(Asr),
        maghrib: formatTime(Maghrib),
        isha: formatTime(Isha),
    };
};

export const calculatePrayerTimes = (latitude: number, longitude: number, methodName: string = 'ISNA') => {
    const date = new Date();
    const timezone = -date.getTimezoneOffset() / 60;
    const method = methods[methodName] || methods.ISNA;
    return prayerTimesInternal(latitude, longitude, timezone, date, method);
};