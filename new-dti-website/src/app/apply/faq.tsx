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
      className="flex flex-col items-center justify-start font-inter"
      style={{
        backgroundImage: "url('/images/apply_faq_bg.png')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh'
      }}
    >
      <div className="w-full max-w-3xl px-4" style={{ marginTop: '10vh' }}>
        {' '}
        // Adjusted for spacing
        <div className="flex flex-col items-start text-left mb-10">
          <h1 className="text-4xl font-bold text-white mb-4">What's next?</h1>
          <p className="text-lg text-white mb-8">
            Learn more about DTI's core values and processes below.
          </p>
        </div>
        <div className="flex justify-start gap-4 mb-10">
          {Object.keys(tabContent).map((tabName) => (
            <button
              key={tabName}
              onClick={() => setActiveTab(tabName)}
              className={`text-white font-semibold px-6 py-2 rounded transition-all duration-300
                            ${activeTab === tabName ? 'bg-[#A52424]' : 'bg-black'}
                            border border-white`}
            >
              {tabName}
            </button>
          ))}
        </div>
        <div className="text-left w-full text-white p-4">
          <div dangerouslySetInnerHTML={{ __html: tabContent[activeTab] }} />
        </div>
      </div>
    </div>
  );
};

export default FAQ;
