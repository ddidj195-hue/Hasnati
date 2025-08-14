import React, { useState } from 'react';
import { duaCategories } from '../data/dua';
import { DuaCategory, Dua } from '../types';

interface DuaCardProps {
  dua: Dua;
}

const DuaCard: React.FC<DuaCardProps> = ({ dua }) => (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border-r-4 border-black dark:border-white mb-4">
        <p className="font-arabic text-xl/loose text-right text-gray-800 dark:text-gray-200 mb-4">{dua.arabic}</p>
        <p className="text-gray-700 dark:text-gray-300 mb-2 italic">"{dua.translation}"</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">{dua.reference}</p>
    </div>
);


interface AccordionItemProps {
  category: DuaCategory;
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ category, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <h2>
        <button
          type="button"
          className="flex items-center justify-between w-full p-5 font-medium text-right text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
          onClick={onClick}
          aria-expanded={isOpen}
        >
          <div className="flex items-center">
            <i className={`ph-fill ph-${category.icon} text-2xl text-black dark:text-white ml-4`}></i>
            <span className="text-lg font-bold">{category.name}</span>
          </div>
          <i className={`ph-fill ph-caret-down text-xl transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
        </button>
      </h2>
      <div
        className={`transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
        style={{ display: 'grid' }}
      >
        <div className="overflow-hidden">
            <div className="p-5 bg-gray-50 dark:bg-gray-900/40">
                {category.duas.map(dua => <DuaCard key={dua.id} dua={dua} />)}
            </div>
        </div>
      </div>
    </div>
  );
};


const DuaPage: React.FC = () => {
  const [openCategoryId, setOpenCategoryId] = useState<number | null>(duaCategories.length > 0 ? duaCategories[0].id : null);

  const handleToggle = (id: number) => {
    setOpenCategoryId(openCategoryId === id ? null : id);
  };

  return (
    <div className="bg-white dark:bg-gray-900/50 rounded-xl shadow-lg">
       <div className="text-center p-8 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-4xl font-bold text-black dark:text-white">حصن المسلم</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">أدعية وأذكار من القرآن والسنة</p>
      </div>
      <div id="accordion-dua">
        {duaCategories.map((category) => (
          <AccordionItem
            key={category.id}
            category={category}
            isOpen={openCategoryId === category.id}
            onClick={() => handleToggle(category.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default DuaPage;