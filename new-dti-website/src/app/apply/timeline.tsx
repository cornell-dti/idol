/* eslint-disable no-param-reassign */

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
  const [userGroup, setUserGroup] = useState<'freshmenTransfer' | 'upperclassmen'>('freshmenTransfer');
  const stages: Stage[] = (stageData as StageData)[userGroup];

  const getCurrentStageIndex = () => {
    const today = new Date();
    const index = stages.findIndex(stage => new Date(stage.date) > today);
    return index === -1 ? stages.length - 1 : index - 1;
  };

  const [currentStageIndex, setCurrentStageIndex] = useState(getCurrentStageIndex);

  const getIcon = (index: number, current: boolean): string => {
    const iconBasePath = '/apply_icons/';
    switch (index) {
      case 0:
        return `${iconBasePath}timeline-applications-${current ? 'open-1' : 'open'}.svg`;
      case 1:
      case 2:
        return `${iconBasePath}timeline-info-sesh-${current ? '1' : ''}.svg`;
      case 3:
        return `${iconBasePath}timeline-applications-${current ? 'due-1' : 'due'}.svg`;
      default:
        return '';
    }
  };

  const handleUserGroupChange = (group: 'freshmenTransfer' | 'upperclassmen') => {
    setUserGroup(group);
    setCurrentStageIndex(getCurrentStageIndex);
  };

  const handleMouseOverOut = (event: React.MouseEvent<HTMLButtonElement>, borderColor: string) => {
    event.currentTarget.style.borderColor = borderColor;
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-auto md:h-screen px-10" style={{
      backgroundImage: "url('/images/apply_timeline_bg.png')",
      backgroundSize: 'cover'
    }}>
      <div className="text-white w-full md:px-0" style={{ alignSelf: 'flex-start' }}>
        <h1 className="text-4xl font-semibold mb-4">This is DTI.</h1>
        <p className="text-3xl font-semibold mb-4">developing, designing, delivering.</p>
      </div>
      <div className="bg-white rounded-lg w-full md:w-3/4 p-6 md:p-0" style={{ borderTopLeftRadius: '25px', borderTopRightRadius: '25px' }}>
        <div className="flex items-center justify-between p-6 md:p-10" style={{
          backgroundColor: '#A52424',
          borderTopLeftRadius: '25px',
          borderTopRightRadius: '25px'
        }}>
          <span className="text-white">cornell-dti/timeline</span>
          <div>
            <button className="text-white rounded-lg px-4 py-2 mx-2" style={{
              backgroundColor: '#A52424',
              border: '2px solid black',
              transition: 'all 0.2s ease-in-out'
            }} onMouseOver={e => handleMouseOverOut(e, 'white')} onMouseOut={e => handleMouseOverOut(e, 'black')} onClick={() => handleUserGroupChange('freshmenTransfer')}>
              Freshmen/Transfer
            </button>
            <button className="text-white rounded-lg px-4 py-2 mx-2" style={{
              backgroundColor: '#A52424',
              border: '2px solid black',
              transition: 'all 0.2s ease-in-out'
            }} onMouseOver={e => handleMouseOverOut(e, 'white')} onMouseOut={e => handleMouseOverOut(e, 'black')} onClick={() => handleUserGroupChange('upperclassmen')}>
              Upperclassmen
            </button>
          </div>
        </div>
        <div className="relative bg-white p-6 md:p-30 text-black rounded-b-lg" style={{ borderBottomLeftRadius: '25px', borderBottomRightRadius: '25px' }}>
          <div className="absolute left-[calc(50%+16px)] top-0 bottom-0 w-3" style={{ backgroundColor: '#A52424' }}></div>
          {stages.map((stage, index) => {
            const isCurrentStage = index === currentStageIndex;
            const iconPath = getIcon(index, isCurrentStage);
            return (
              <div key={index} className="flex mt-8 first:mt-0 ml-16 relative">
                <div className="relative flex-shrink-0">
                  <img src={`/apply_icons/${isCurrentStage ? 'selected-timeline-event' : 'unselected-timeline-event'}.svg`} alt="" className="w-16 h-16" />
                  <img src={iconPath} alt="" className="absolute inset-0 m-auto w-auto h-auto" style={{ maxWidth: '70%', maxHeight: '70%' }} />
                </div>
                <div className="ml-8">
                  <h3 className={`text-xl ${isCurrentStage ? 'font-bold text-2xl' : 'font-semibold'} ml-4`}>{stage.title}</h3>
                  <p className={`text-base ${isCurrentStage ? 'text-lg' : ''} ml-4`}>{stage.content}</p>
                  <div className="flex items-center mt-2 ml-4">
                    <img src={isCurrentStage ? '/apply_icons/timeline-location-1.svg' : '/apply_icons/timeline-location.svg'} alt="Location" className="w-6 h-6" />
                    <span className={`mx-2 ${isCurrentStage ? 'text-black' : 'text-gray-400'}`}>{stage.location}</span>
                    <img src={isCurrentStage ? '/apply_icons/timeline-calendar-1.svg' : '/apply_icons/timeline-calendar.svg'} alt="Calendar" className="w-6 h-6" />
                    <span className={`mx-2 ${isCurrentStage ? 'text-black' : 'text-gray-400'}`}>{new Date(stage.date).toLocaleDateString()}</span>
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
