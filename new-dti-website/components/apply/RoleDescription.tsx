import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import applicationData from './data/applications.json';
import config from '../../config.json';
import RedBlob from '../blob';
import { isAppOpen } from '@/src/utils/dateUtils';

const applications = applicationData as {
  [key: string]: {
    roleName: string;
    icon: { src: string; width: number; height: number };
    skills: string[];
    responsibilities: string[];
  };
};

const RoleDescriptions = () => {
  const [role, setRole] = useState<string>('product');

  return (
    <div className="relative flex justify-center text-[#FEFEFE]">
      <RedBlob className="top-[-250px] right-[-350px] z-0" intensity={0.5} />
      <div className="relative flex flex-col max-w-5xl w-full gap-11 lg:px-5 md:px-[60px] xs:px-6 z-10">
        <h2 className="font-semibold md:text-[32px] md:leading-[38px] xs:text-[24px] xs:leading-[29px]">
          Applications
        </h2>
        <div className="flex md:gap-20 xs:gap-3 lg:mx-14 md:mx-10 justify-between">
          {Object.keys(applications).map((application) => {
            const { icon } = applications[application];
            return (
              <div className="flex flex-col items-center gap-7" key={application}>
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
                  alt={application}
                  width={icon.width}
                  height={icon.height}
                  className={`${role === application ? '' : 'brightness-50'} cursor-pointer 
                    lg:h-[90px] md:h-[73px] xs:h-[44px] w-auto`}
                  onClick={() => setRole(application)}
                />
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-5">
          {Object.keys(applications).map((application) => {
            const roleApplication = applications[application];
            return (
              role === application && (
                <>
                  <h3
                    className="font-semibold lg:text-[32px] lg:leading-[38px] md:text-[24px] 
                    md:leading-[29px] xs:text-[22px]"
                  >
                    {roleApplication.roleName} Application
                  </h3>
                  <div className="space-y-2">
                    <h3
                      className="font-semibold lg:text-[24px] lg:leading-[29px] md:text-[20px] 
                      md:leading-[24px] xs:text-[14px] xs:leading-[17px]"
                    >
                      What we're looking for...
                    </h3>
                    <ul className="marker:text-[#FEFEFE] list-disc pl-8">
                      {roleApplication.skills.map((skill) => (
                        <li className="md:text-[22px] md:leading-[28px] xs:text-[12px] xs:leading-[14px]">
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h3
                      className="font-semibold lg:text-[24px] lg:leading-[29px] md:text-[20px] 
                      md:leading-[24px] xs:text-[14px] xs:leading-[17px]"
                    >
                      Responsibilities at a glance...
                    </h3>
                    <ul className="marker:text-[#FEFEFE] list-disc pl-8">
                      {roleApplication.responsibilities.map((resp) => (
                        <li className="md:text-[22px] md:leading-[28px] xs:text-[12px] xs:leading-[14px]">
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )
            );
          })}
        </div>
        {isAppOpen() ? (
          <Link key="Apply Page" href={config.applicationLink} className="primary-button">
            Apply now
          </Link>
        ) : (
          <></>
        )}
      </div>
      <RedBlob className="bottom-[-300px] left-[-350px] z-0" intensity={0.5} />
    </div>
  );
};

export default RoleDescriptions;
