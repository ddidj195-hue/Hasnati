import React from 'react';
import { ASMA_UL_HUSNA } from '../data/asmaulHusna';
import { NameOfAllah } from '../types';

const NameCard: React.FC<{ name: NameOfAllah }> = ({ name }) => (
  <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-lg flex flex-col items-center justify-center text-center transform hover:-translate-y-1 transition-transform duration-300 border-t-4 border-black dark:border-white">
    <span className="text-gray-500 dark:text-gray-400 text-sm mb-2">#{name.number}</span>
    <h3 className="text-3xl font-arabic font-bold text-black dark:text-white mb-1">{name.name}</h3>
    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">{name.transliteration}</p>
    <p className="text-gray-500 dark:text-gray-400 mt-2">"{name.en.meaning}"</p>
  </div>
);

const AsmaulHusnaPage: React.FC = () => {
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-black dark:text-white">أسماء الله الحسنى</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">The 99 Names of Allah</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {ASMA_UL_HUSNA.map((name) => (
          <NameCard key={name.number} name={name} />
        ))}
      </div>
    </div>
  );
};

export default AsmaulHusnaPage;