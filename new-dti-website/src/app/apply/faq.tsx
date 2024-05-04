'use client';

import React, { useState } from 'react';
import tabContentData from './tab-content.json';

interface TabContent {
    [key: string]: string;
}

const tabContent: TabContent = tabContentData;

const FAQ: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('General Questions');

    return (
        <div
            className="flex flex-col justify-center "
            style={{
                backgroundImage: "url('/images/apply_faq.png')",
                backgroundSize: 'cover'
            }}
        >
            <div className="flex justify-center gap-4 mb-10">
                <h1 className="text-4xl font-bold text-white mb-4">What's next?</h1>
                <p className="text-lg text-white mb-8">Learn more about DTI's core values and processes below.</p>
                {Object.keys(tabContent).map((tabName) => (
                    <button
                        key={tabName}
                        onClick={() => setActiveTab(tabName)}
                        className={`text-white font-semibold px-6 py-2 rounded transition-all duration-300
                        ${activeTab === tabName ? 'bg-[#A52424]' : 'bg-black'}`}
                    >
                        {tabName}
                    </button>
                ))}
            </div>
            <div className="text-left w-full md:w-3/4 xl:w-1/2 mx-auto text-white p-4">
                <div dangerouslySetInnerHTML={{ __html: tabContent[activeTab] }} />
            </div>
        </div>
    );
};

export default FAQ;
