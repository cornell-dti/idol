import { useState } from 'react';
import Image from 'next/image';
import applicationData from './data/applications.json';

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
    <div className="flex justify-center text-[#FEFEFE]">
      <div className="flex flex-col max-w-5xl w-full gap-11">
        <h2 className="font-semibold text-[32px] leading-[38px]">Applications</h2>
        <div className="flex gap-20 mx-14 justify-between">
          {Object.keys(applications).map((application) => {
            const { icon } = applications[application];
            return (
              <div className="flex flex-col items-center gap-7" key={application}>
                <h3
                  className={`text-[24px] leading-[29px] ${
                    role === application ? 'font-semibold' : 'text-[#877B7B]'
                  }`}
                >
                  {application.charAt(0).toUpperCase() + application.substring(1)}
                </h3>
                <Image
                  src={icon.src}
                  alt={application}
                  width={icon.width}
                  height={icon.height}
                  className={`${role === application ? '' : 'brightness-50'} cursor-pointer`}
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
                  <h3 className="font-semibold text-[32px] leading-[38px]">
                    {roleApplication.roleName} Application
                  </h3>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-[24px] leading-[29px]">
                      What we're looking for...
                    </h3>
                    <ul className="marker:text-[#FEFEFE] list-disc pl-8">
                      {roleApplication.skills.map((skill) => (
                        <li className="text-[22px] leading-[28px]">{skill}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-[24px] leading-[29px]">
                      Responsibilities at a glance...
                    </h3>
                    <ul className="marker:text-[#FEFEFE] list-disc pl-8">
                      {roleApplication.responsibilities.map((resp) => (
                        <li className="text-[22px] leading-[28px]">{resp}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )
            );
          })}
        </div>
        <button
          className="rounded-xl py-3 px-[20px] bg-[#A52424] text-white 
          font-bold hover:bg-white hover:text-[#A52424] w-fit"
        >
          Apply now
        </button>
      </div>
    </div>
  );
};

export default RoleDescriptions;
