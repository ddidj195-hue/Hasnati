import React, { useState, useEffect } from 'react';
import { ZakatAssets } from '../types';

// Placeholder values, in a real app these would be fetched from an API
const NISAB_GOLD_GRAMS = 85;
const NISAB_SILVER_GRAMS = 595;

const ZakatCalculatorPage: React.FC = () => {
    const [assets, setAssets] = useState<ZakatAssets>({
        cash: 0,
        gold: 0,
        silver: 0,
        investments: 0,
    });
    const [goldPrice, setGoldPrice] = useState(70); // Price per gram in USD (example)
    const [silverPrice, setSilverPrice] = useState(0.9); // Price per gram in USD (example)

    const [totalAssets, setTotalAssets] = useState(0);
    const [nisabValue, setNisabValue] = useState(0);
    const [isLiable, setIsLiable] = useState(false);
    const [zakatAmount, setZakatAmount] = useState(0);

    useEffect(() => {
        const nisab = goldPrice * NISAB_GOLD_GRAMS;
        const total = assets.cash + (assets.gold * goldPrice) + (assets.silver * silverPrice) + assets.investments;

        setNisabValue(nisab);
        setTotalAssets(total);

        if (total >= nisab) {
            setIsLiable(true);
            setZakatAmount(total * 0.025);
        } else {
            setIsLiable(false);
            setZakatAmount(0);
        }
    }, [assets, goldPrice, silverPrice]);

    const handleAssetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAssets(prev => ({ ...prev, [name]: Number(value) }));
    };

    const InputField: React.FC<{ name: keyof ZakatAssets, label: string, placeholder: string }> = ({ name, label, placeholder }) => (
        <div>
            <label htmlFor={name} className="block mb-2 font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <div className="relative">
                 <input type="number" id={name} name={name} value={assets[name]} onChange={handleAssetChange} placeholder={placeholder}
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">{name === 'cash' || name === 'investments' ? '$' : 'جرام'}</span>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Calculator Inputs */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg space-y-6">
                <h2 className="text-3xl font-bold text-black dark:text-white border-b pb-4 mb-6">حاسبة الزكاة</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField name="cash" label="النقد (في اليد والبنك)" placeholder="أدخل المبلغ" />
                    <InputField name="investments" label="قيمة الاستثمارات (الأسهم، العقارات التجارية)" placeholder="أدخل القيمة" />
                    <InputField name="gold" label="الذهب (عيار 24)" placeholder="أدخل الوزن بالجرام" />
                    <InputField name="silver" label="الفضة" placeholder="أدخل الوزن بالجرام" />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t mt-6">
                    <div>
                        <label htmlFor="goldPrice" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">سعر جرام الذهب ($)</label>
                        <input type="number" id="goldPrice" value={goldPrice} onChange={e => setGoldPrice(Number(e.target.value))} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500" />
                    </div>
                    <div>
                        <label htmlFor="silverPrice" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">سعر جرام الفضة ($)</label>
                        <input type="number" id="silverPrice" value={silverPrice} onChange={e => setSilverPrice(Number(e.target.value))} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500" />
                    </div>
                 </div>
                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">ملاحظة: أسعار الذهب والفضة هي قيم تقديرية. يرجى إدخال السعر الحالي في بلدك للحصول على أدق حساب.</p>
            </div>

            {/* Results */}
            <div className="bg-black dark:bg-white text-white dark:text-black p-8 rounded-xl shadow-lg flex flex-col justify-center space-y-6">
                <h2 className="text-3xl font-bold border-b border-gray-600 dark:border-gray-300 pb-4">النتيجة</h2>
                <div className="flex justify-between items-center">
                    <span className="font-medium">قيمة النصاب (ما يعادل 85 جرام ذهب):</span>
                    <span className="font-bold text-2xl">${nisabValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-medium">مجموع أموالك الزكوية:</span>
                    <span className="font-bold text-2xl">${totalAssets.toFixed(2)}</span>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-600 dark:border-gray-300 text-center">
                    {isLiable ? (
                        <>
                            <p className="text-lg text-gray-200 dark:text-gray-800">لقد بلغت النصاب، تجب عليك الزكاة.</p>
                            <p className="text-5xl font-extrabold mt-2">${zakatAmount.toFixed(2)}</p>
                            <p className="text-sm text-gray-300 dark:text-gray-700 mt-1">(2.5% من إجمالي الأصول)</p>
                        </>
                    ) : (
                        <p className="text-xl font-bold text-gray-200 dark:text-gray-800">لم تبلغ النصاب، لا تجب عليك الزكاة حاليًا.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ZakatCalculatorPage;