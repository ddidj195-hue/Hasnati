import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { prophetStories } from '../data/prophetStories';

const StoryRenderer: React.FC<{ content: string }> = ({ content }) => {
  // Split the content by the markdown-like bold syntax, keeping the delimiters
  const parts = content.split(/(\*\*.*?\*\*)/g).filter(Boolean);
  return (
    <p className="whitespace-pre-line leading-relaxed md:leading-loose">
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          // Render bold part inside a <strong> tag
          return <strong key={index}>{part.substring(2, part.length - 2)}</strong>;
        }
        // Render normal text part
        return part;
      })}
    </p>
  );
};

const ProphetStoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const story = prophetStories.find(p => p.id === Number(id));

  if (!story) {
    // If story not found, redirect to the main prophets page
    return <Navigate to="/prophets" replace />;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 animate-fade-in">
        <div className="mb-6">
            <Link to="/prophets" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors group">
                 <i className="ph-fill ph-arrow-right text-xl ml-2 transition-transform group-hover:-translate-x-1"></i>
                <span>العودة إلى قائمة الأنبياء</span>
            </Link>
        </div>
        
        <article>
            <header className="text-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white font-arabic">{story.name}</h1>
                <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">{story.description}</p>
            </header>

            <div className="prose prose-lg dark:prose-invert max-w-none text-right">
                <StoryRenderer content={story.story} />
            </div>

            {story.gallery && story.gallery.length > 0 && (
                <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h2 className="text-3xl font-bold text-center mb-8 text-black dark:text-white">من مشاهد القصة</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {story.gallery.map((item, index) => (
                            <figure key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg overflow-hidden shadow-md group">
                                <img 
                                    src={item.imageUrl} 
                                    alt={item.caption} 
                                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                                />
                                <figcaption className="p-4 text-center text-gray-700 dark:text-gray-300">
                                    {item.caption}
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </section>
            )}
        </article>

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

export default ProphetStoryPage;