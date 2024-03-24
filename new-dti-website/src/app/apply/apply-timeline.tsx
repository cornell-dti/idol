'use client';

import React, { useState } from 'react';

const ApplyTimeline: React.FC = () => {
  const stages = [
    {
      title: 'APPLICATIONS OPEN!',
      content:
        'We’re welcoming any and all students who are looking to make a difference through tech. Applicants are not considered on a rolling basis.',
      date: '2024-03-14',
      location: 'Online Submission'
    },
    {
      title: 'INFORMATION SESSION 1',
      content:
        'Come join us for a session to learn about DTI, our goals, and our subteams. There will be time to chat with DTI members of all roles after!',
      date: '2024-03-18',
      location: 'Goldwin Smith Hall G26'
    },
    {
      title: 'INFORMATION SESSION 2',
      content:
        'We’re welcoming any and all students who are looking to make a difference through tech. Applicants are not considered on a rolling basis.',
      date: '2024-03-19',
      location: 'Kimball Hall B11'
    },
    {
      title: 'APPLICATIONS DUE!',
      content:
        'We’re welcoming any and all students who are looking to make a difference through tech. Applicants are not considered on a rolling basis.',
      date: '2024-04-01',
      location: 'Online Submission'
    }
  ];

  const getCurrentStageIndex = () => {
    const today = new Date();
    const index = stages.findIndex((stage) => new Date(stage.date) > today);
    return index === -1 ? stages.length - 1 : index - 1;
  };

  const [currentStageIndex] = useState(getCurrentStageIndex());

  const getIcon = (index: number, current: boolean) => {
    const iconBasePath = '/apply_icons/';
    if (index === 0) {
      return `${iconBasePath}timeline-applications-${current ? 'open-1' : 'open'}.png`;
    } else if (index === 1 || index === 2) {
      return `${iconBasePath}timeline-info-sesh-${current ? '1' : ''}.png`;
    } else if (index === 3) {
      return `${iconBasePath}timeline-applications-${current ? 'due-1' : 'due'}.png`;
    }
    return '';
  };

  return (
    <div
      className="flex flex-col items-center justify-center w-screen h-screen"
      style={{
        backgroundImage: "url('/images/apply_timeline_bg.png')",
        backgroundSize: 'cover'
      }}
    >
      <div className="text-white" style={{ alignSelf: 'flex-start', marginLeft: '212px' }}>
        <h1 className="text-4xl font-semibold" style={{ marginBottom: '40px' }}>
          This is DTI.
        </h1>
        <p className="text-3xl mt-2 font-semibold">developing, designing, delivering.</p>
      </div>
      <div
        className="mt-10 bg-white rounded-lg w-3/4"
        style={{ borderTopLeftRadius: '25px', borderTopRightRadius: '25px' }}
      >
        <div
          className="flex items-center justify-between px-10 py-2"
          style={{
            backgroundColor: '#A52424',
            borderTopLeftRadius: '25px',
            borderTopRightRadius: '25px'
          }}
        >
          <span className="text-white">cornell-dti/timeline</span>
          <div>
            <button
              className="text-white rounded-lg px-4 py-2 mx-2"
              style={{
                backgroundColor: '#A52424',
                border: '2px solid black',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseOver={(e) => (e.currentTarget.style.borderColor = 'white')}
              onMouseOut={(e) => (e.currentTarget.style.borderColor = 'black')}
            >
              Freshmen/Transfer
            </button>
            <button
              className="text-white rounded-lg px-4 py-2 mx-2"
              style={{
                backgroundColor: '#A52424',
                border: '2px solid black',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseOver={(e) => (e.currentTarget.style.borderColor = 'white')}
              onMouseOut={(e) => (e.currentTarget.style.borderColor = 'black')}
            >
              Upperclassmen
            </button>
          </div>
        </div>
        <div
          className="relative bg-white p-30 text-black rounded-b-lg"
          style={{ borderBottomLeftRadius: '25px', borderBottomRightRadius: '25px' }}
        >
          <div
            className="absolute left-20 top-0 bottom-0 w-3"
            style={{ backgroundColor: '#A52424' }}
          ></div>
          {stages.map((stage, index) => {
            const isCurrentStage = index === currentStageIndex;
            const iconPath = getIcon(index, isCurrentStage);
            return (
              <div key={index} className="flex mt-8 first:mt-0 ml-16">
                <div className="relative flex-shrink-0">
                  <img
                    src={`/apply_icons/${
                      isCurrentStage ? 'selected-timeline-event' : 'unselected-timeline-event'
                    }.png`}
                    alt=""
                    className="w-16 h-16"
                  />
                  <img src={iconPath} alt="" className="absolute inset-0 m-auto w-auto h-auto" />
                </div>
                <div className="ml-8">
                  <h3
                    className={`text-xl ${
                      isCurrentStage ? 'font-bold text-2xl' : 'font-semibold'
                    } ml-4`}
                  >
                    {stage.title}
                  </h3>
                  <p className={`text-base ${isCurrentStage ? 'text-lg' : ''} ml-4`}>
                    {stage.content}
                  </p>
                  <div className="flex items-center mt-2 ml-4">
                    <img
                      src={
                        isCurrentStage
                          ? '/apply_icons/timeline-location_select.png'
                          : '/apply_icons/timeline-location.png'
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
                          ? '/apply_icons/timeline-calendar_select.png'
                          : '/apply_icons/timeline-calendar.png'
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
