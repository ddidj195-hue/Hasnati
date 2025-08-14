import React from 'react';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  to: string;
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ to, icon, title, description }) => (
  <Link to={to} className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-2xl dark:hover:shadow-black/50 hover:-translate-y-2 transition-all duration-300 ease-in-out flex flex-col items-center text-center group">
      <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-3 sm:p-4 rounded-full mb-4 transition-colors duration-300 group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black">
        <i className={`ph-fill ph-${icon} text-3xl sm:text-4xl`}></i>
      </div>
      <h3 className="text-xl font-bold text-black dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{description}</p>
  </Link>
);

const DashboardPage: React.FC = () => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const islamicDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', options).format(date);
  
  return (
    <div className="space-y-8">
      <div className="p-8 bg-gray-100 dark:bg-gray-900 rounded-2xl text-black dark:text-white shadow-xl dark:shadow-2xl dark:shadow-black/50">
        <h1 className="text-4xl font-bold">أهلاً بك في حسناتي</h1>
        <p className="text-lg mt-2 text-gray-700 dark:text-gray-300">"ألا بذكر الله تطمئن القلوب"</p>
        <p className="text-lg mt-4 font-semibold text-gray-800 dark:text-gray-200">{islamicDate}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard to="/quran" icon="book-open" title="القرآن الكريم" description="تصفح وقراءة سور القرآن الكريم بسهولة ويسر." />
        <FeatureCard to="/audio-player" icon="speaker-high" title="مشغل القرآن" description="استمع إلى القرآن الكريم بأصوات نخبة من القراء." />
        <FeatureCard to="/hadith" icon="book-bookmark" title="مكتبة الحديث" description="تصفح وقراءة الأحاديث النبوية الشريفة." />
        <FeatureCard to="/asma-ul-husna" icon="sparkle" title="أسماء الله الحسنى" description="تعرف على أسماء الله الحسنى ومعانيها العظيمة." />
        <FeatureCard to="/prophets" icon="scroll" title="قصص الأنبياء" description="استكشف قصص الأنبياء والرسل المليئة بالحكم." />
        <FeatureCard to="/dua" icon="shield-check" title="حصن المسلم" description="أدعية وأذكار من القرآن والسنة لتكون في حفظ الله." />
        <FeatureCard to="/prayer-times" icon="clock" title="مواقيت الصلاة" description="تابع أوقات الصلاة اليومية بدقة حسب موقعك." />
        <FeatureCard to="/qibla" icon="compass" title="اتجاه القبلة" description="حدد اتجاه القبلة بدقة من أي مكان في العالم." />
        <FeatureCard to="/tasbih" icon="hand-praying" title="التسبيح" description="استخدم المسبحة الإلكترونية لذكر الله في كل وقت." />
        <FeatureCard to="/zakat" icon="coins" title="حاسبة الزكاة" description="أداة سهلة لحساب زكاة أموالك بدقة." />
        <FeatureCard to="/downloads" icon="download-simple" title="المكتبة" description="استمع للسور التي نزلتها بدون الحاجة للإنترنت." />
      </div>
    </div>
  );
};

export default DashboardPage;