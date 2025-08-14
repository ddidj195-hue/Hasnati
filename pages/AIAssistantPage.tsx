import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import { ChatMessage } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `أنت مساعد إسلامي خبير ومتعاون اسمه "الرفيق الإيماني". مهمتك هي الإجابة على الأسئلة المتعلقة بالإسلام، شرح الآيات القرآنية، رواية قصص الأنبياء، وتقديم الأدعية الإسلامية. يجب أن تكون إجاباتك دقيقة، محترمة، ومستندة إلى مصادر إسلامية موثوقة كلما أمكن. عند شرح الآيات، اذكر التفسير المعتمد. عند تقديم الأدعية، اذكر مصدرها إن وجد. خاطب المستخدم بلطف واحترام. لا تجب على أسئلة خارج نطاق الدين الإسلامي. تأكد من أن تكون الردود مناسبة لجميع الأعمار. نسق إجاباتك باستخدام Markdown البسيط (مثل **للخط العريض** و *للقوائم النقطية*).`;

const suggestionPrompts = [
    "اشرح لي معنى آية الكرسي",
    "ما هو فضل صيام يوم عرفة؟",
    "قصة نبي الله موسى مع فرعون",
    "دعاء للشعور بالقلق",
];

const AIAssistantPage: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const chatSession = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction
            }
        });
        setChat(chatSession);
    }, []);

    useEffect(() => {
        chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (prompt?: string) => {
        const userInput = prompt || input;
        if (!userInput.trim() || isLoading || !chat) return;

        setIsLoading(true);
        setInput('');
        
        const userMessage: ChatMessage = { role: 'user', text: userInput };
        // Add user message and an empty placeholder for the model's response
        setMessages(prev => [...prev, userMessage, { role: 'model', text: '' }]);

        try {
            const stream = await chat.sendMessageStream({ message: userInput });
            let streamedText = '';
            for await (const chunk of stream) {
                streamedText += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { role: 'model', text: streamedText };
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { role: 'model', text: 'عفواً، حدث خطأ أثناء محاولة التواصل مع المساعد. يرجى المحاولة مرة أخرى.' };
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleSend();
    };

    const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
        const parts = content.split(/(\*\*.*?\*\*|\* .*)/g).filter(Boolean);
        return (
            <div>
                {parts.map((part, index) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={index}>{part.substring(2, part.length - 2)}</strong>;
                    }
                     if (part.startsWith('* ')) {
                        return <div key={index} className="flex items-start"><span className="mr-2 mt-1">•</span><span>{part.substring(2)}</span></div>;
                    }
                    return <span key={index}>{part}</span>;
                })}
            </div>
        );
    };

    return (
        <div className="flex flex-col min-h-[75vh] bg-white dark:bg-gray-900 rounded-xl shadow-lg" dir="rtl">
            <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto space-y-6">
                {messages.length === 0 && (
                    <div className="text-center animate-fade-in">
                        <i className="ph-fill ph-brain text-6xl text-black dark:text-white mb-4"></i>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">الرفيق الإيماني</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">السلام عليكم، كيف يمكنني مساعدتك اليوم؟</p>
                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            {suggestionPrompts.map(prompt => (
                                <button key={prompt} onClick={() => handleSend(prompt)} className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                         {msg.role === 'model' && <i className="ph-fill ph-brain text-2xl text-black dark:text-white mt-2"></i>}
                        <div className={`max-w-xl p-3 sm:p-4 rounded-2xl ${msg.role === 'user' ? 'bg-black text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                           <div className="prose dark:prose-invert prose-sm max-w-none leading-relaxed whitespace-pre-wrap"><MarkdownRenderer content={msg.text} /></div>
                           {isLoading && msg.role === 'model' && index === messages.length -1 && <span className="inline-block w-2 h-4 bg-gray-600 dark:bg-gray-300 ml-1 animate-pulse"></span>}
                        </div>
                        {msg.role === 'user' && <i className="ph-fill ph-user-circle text-2xl text-gray-500 mt-2"></i>}
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <form onSubmit={handleSubmit} className="flex items-center gap-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="اسأل سؤالاً..."
                        disabled={isLoading}
                        className="flex-1 w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                    />
                    <button type="submit" disabled={isLoading || !input.trim()} className="p-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                        {isLoading ? <i className="ph ph-spinner animate-spin text-2xl"></i> : <i className="ph-fill ph-paper-plane-right text-2xl"></i>}
                    </button>
                </form>
            </div>
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

export default AIAssistantPage;