'use client';

import React, { useState } from 'react';
import stageData from './timeline-stages.json';

interface Stage {
  title: string;
  content: string;
  date: string;
  location: string;
}

interface StageData {
  freshmenTransfer: Stage[];
  upperclassmen: Stage[];
}

const ApplyTimeline: React.FC = () => {
  const [userGroup, setUserGroup] = useState<'freshmenTransfer' | 'upperclassmen'>(
    'freshmenTransfer'
  );
  const stages: Stage[] = (stageData as StageData)[userGroup];

  const getCurrentStageIndex = () => {
    const today = new Date();
    const index = stages.findIndex((stage) => new Date(stage.date) > today);
    return index === -1 ? stages.length - 1 : index - 1;
  };

  const [currentStageIndex, setCurrentStageIndex] = useState(getCurrentStageIndex);

  const getIcon = (index: number, current: boolean): string => {
    const iconBasePath = '/apply_icons/';
    switch (index) {
      case 0:
        return `${iconBasePath}timeline-applications-${current ? 'open-1' : 'open'}.svg`;
      case 1:
        return `${iconBasePath}timeline-info-sesh-${current ? '1' : ''}.svg`;
      case 2:
        return `${iconBasePath}timeline-info-sesh-${current ? '1' : ''}.svg`;
      case 3:
        return `${iconBasePath}timeline-applications-${current ? 'due-1' : 'due'}.svg`;
      default:
        return '';
    }
  };

  return (
    <div
      className="flex flex-col items-start justify-start font-inter"
      style={{
        backgroundImage: "url('/images/apply_timeline_bg.png')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '100vh'
      }}
    >
      <div className="w-full md:w-3/4" style={{ marginLeft: '10%', marginTop: '10vh' }}>
        <h1 className="text-4xl font-semibold text-white mb-4">This is DTI.</h1>
        <p className="text-3xl font-semibold text-white mb-4">developing, designing, delivering.</p>
        <div
          className="bg-[#A52424] rounded-t-lg p-6"
          style={{
            borderTopLeftRadius: '25px',
            borderTopRightRadius: '25px'
          }}
        >
          <span className="text-white">cornell-dti/timeline</span>
          <div className="flex justify-end">
            <button
              className={`rounded-lg px-4 py-2 mx-2 transition-all duration-300 ${
                userGroup === 'freshmenTransfer'
                  ? 'bg-white text-[#A52424]'
                  : 'bg-transparent text-white'
              }`}
              onClick={() => {
                setUserGroup('freshmenTransfer');
                setCurrentStageIndex(getCurrentStageIndex);
              }}
            >
              Freshmen/Transfer
            </button>
            <button
              className={`rounded-lg px-4 py-2 mx-2 transition-all duration-300 ${
                userGroup === 'upperclassmen'
                  ? 'bg-white text-[#A52424]'
                  : 'bg-transparent text-white'
              }`}
              onClick={() => {
                setUserGroup('upperclassmen');
                setCurrentStageIndex(getCurrentStageIndex);
              }}
            >
              Upperclassmen
            </button>
          </div>
        </div>
        <div
          className="bg-white rounded-b-lg p-6 text-black relative"
          style={{ borderBottomLeftRadius: '25px', borderBottomRightRadius: '25px' }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50px',
              top: 0,
              bottom: 0,
              width: '12px',
              backgroundColor: '#A52424',
              zIndex: 0
            }}
          />
          {stages.map((stage, index) => {
            const isCurrentStage = index === currentStageIndex;
            const iconPath = getIcon(index, isCurrentStage);
            return (
              <div key={index} className="flex mt-8 first:mt-0 relative">
                <div className="relative flex-shrink-0 z-10">
                  <img
                    src={`/apply_icons/${isCurrentStage ? 'selected-timeline-event' : 'unselected-timeline-event'}.svg`}
                    alt=""
                    className="w-16 h-16"
                  />
                  <img
                    src={iconPath}
                    alt=""
                    className="absolute inset-0 m-auto w-auto h-auto"
                    style={{ maxWidth: '70%', maxHeight: '70%' }}
                  />
                </div>
                <div className="ml-8">
                  <h3
                    className={`text-xl ${isCurrentStage ? 'font-bold text-2xl' : 'font-semibold'}`}
                  >
                    {stage.title}
                  </h3>
                  <p className={`text-base ${isCurrentStage ? 'text-lg' : ''}`}>{stage.content}</p>
                  <div className="flex items-center mt-2">
                    <img
                      src={
                        isCurrentStage
                          ? '/apply_icons/timeline-location-1.svg'
                          : '/apply_icons/timeline-location.svg'
                      }
                      alt="Location"
                      className="w-6 h-6"
                    />
                    <span className={`mx-2 ${isCurrentStage ? 'text-black' : 'text-gray-400'}`}>
                      {stage.location}
                    </span>
                    <img
                      src={
                        isCurrentStage
                          ? '/apply_icons/timeline-calendar-1.svg'
                          : '/apply_icons/timeline-calendar.svg'
                      }
                      alt="Calendar"
                      className="w-6 h-6"
                    />
                    <span className={`mx-2 ${isCurrentStage ? 'text-black' : 'text-gray-400'}`}>
                      {new Date(stage.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ApplyTimeline;
