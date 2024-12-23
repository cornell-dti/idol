import { useState } from 'react';
import Image from 'next/image';

import applicationData from './data/applications.json';
import config from '../../config.json';
import RedBlob from '../blob';
import { isAppOpen } from '../../src/utils/dateUtils';
import SectionWrapper from '../hoc/SectionWrapper';

const applications = applicationData as {
  [key: string]: {
    roleName: string;
    icon: { src: string; width: number; height: number };
    skills: string[];
    responsibilities: string[];
  };
};

const RoleDescriptions = () => {
  const [role, setRole] = useState<string>('development');

  return (
    <section id="Role Descriptions" className="relative flex justify-center text-[#FEFEFE]">
      <RedBlob className="top-[-250px] right-[-350px] z-0" intensity={0.5} />
      <SectionWrapper id={'Apply Page Role Description Wrapper'} className="w-[1200px]">
        <div className="relative flex flex-col w-full gap-11 z-10">
          <h2 className="font-semibold md:text-[32px] md:leading-[38px] xs:text-[24px] xs:leading-[29px]">
            Applications
          </h2>
          <div className="flex md:gap-20 xs:gap-3 lg:mx-14 md:mx-10 justify-between">
            {Object.keys(applications).map((application) => {
              const { icon } = applications[application];
              return (
                <button
                  onClick={() => setRole(application)}
                  aria-label={`Show ${application} questions`}
                  className="application-role-tab flex flex-col items-center gap-7"
                  key={application}
                >
                  <h3
                    className={`lg:text-[24px] lg:leading-[29px] md:text-[18px] md:leading-[22px] 
                    xs:text-[16px] xs:leading-[19px] ${
                      role === application ? 'font-semibold' : 'text-[#877B7B] font-medium'
                    }`}
                  >
                    {application.charAt(0).toUpperCase() + application.substring(1)}
                  </h3>
                  <Image
                    src={icon.src}
                    alt=""
                    width={icon.width}
                    height={icon.height}
                    className={`${role === application ? '' : 'brightness-50'}
                      lg:h-[90px] md:h-[73px] xs:h-[44px] w-auto`}
                  />
                </button>
              );
            })}
          </div>
          <div className="flex flex-col">
            {Object.keys(applications).map((application, index) => {
              const roleApplication = applications[application];
              return (
                role === application && (
                  <div key={index} className="flex flex-col md:gap-6 xs:gap-4">
                    <h3
                      className="font-semibold lg:text-[32px] lg:leading-[38px] md:text-[24px] 
                    md:leading-[29px] xs:text-[22px]"
                    >
                      {roleApplication.roleName} Application
                    </h3>
                    <div className="space-y-4">
                      <h3
                        className="font-semibold lg:text-[24px] lg:leading-[29px] md:text-[20px] 
                      md:leading-[24px] xs:text-[14px] xs:leading-[17px]"
                      >
                        What we're looking for...
                      </h3>
                      <ul className="marker:text-[#FEFEFE] list-disc pl-8">
                        {roleApplication.skills.map((skill, index) => (
                          <li
                            className="md:text-[22px] md:leading-[28px] xs:text-[12px] xs:leading-[14px]"
                            key={index}
                          >
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h3
                        className="font-semibold lg:text-[24px] lg:leading-[29px] md:text-[20px] 
                      md:leading-[24px] xs:text-[14px] xs:leading-[17px]"
                      >
                        Responsibilities at a glance...
                      </h3>
                      <ul className="marker:text-[#FEFEFE] list-disc pl-8">
                        {roleApplication.responsibilities.map((resp, index) => (
                          <li
                            className="md:text-[22px] md:leading-[28px] xs:text-[12px] xs:leading-[14px]"
                            key={index}
                          >
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              );
            })}
          </div>
          {isAppOpen() ? (
            <a key="Apply Page" href={config.applicationLink} className="primary-button">
              Apply now
            </a>
          ) : (
            <button
              key="Apply Page"
              className="primary-button opacity-50 cursor-not-allowed"
              onClick={(e) => e.preventDefault()}
              aria-disabled="true"
            >
              Apply now
            </button>
          )}
        </div>
      </SectionWrapper>
      <RedBlob className="bottom-[-300px] left-[-350px] z-0" intensity={0.5} />
    </section>
  );
};

export default RoleDescriptions;
