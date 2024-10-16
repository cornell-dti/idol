import { Dispatch, SetStateAction, useState } from 'react';
import Image from 'next/image';
import { ibm_plex_mono } from '../../src/app/layout';
import FA23Members from '../../../backend/src/members-archive/fa23.json';
import useScreenSize from '../../src/hooks/useScreenSize';
import RedBlob from '../blob';
import { LAPTOP_BREAKPOINT, TABLET_BREAKPOINT } from '../../src/consts';
import { getGeneralRole, populateObject } from '../../src/utils/memberUtils';

const chartRadius = 175;
const chartHoverRadius = 190;

type roleStatistics = {
  [key: string]: {
    name: string;
    color: string;
    people: number;
    majors: Set<string>;
    colleges: Set<string>;
  };
};

type PieChartProps = {
  width: number;
  height: number;
  chartSection: string | undefined;
  setChartSection: Dispatch<SetStateAction<string | undefined>>;
  roleStats: roleStatistics;
  allMembers: IdolMember[];
};

const PieChart: React.FC<PieChartProps> = ({
  width,
  height,
  chartSection,
  setChartSection,
  roleStats,
  allMembers
}) => {
  let previousPoint = [0, -chartRadius];
  let totalAngle = 0;

  const polarToRect = (angle: number, radius: number) => {
    const newX = -radius * Math.cos(angle + Math.PI / 2);
    const newY = -radius * Math.sin(angle + Math.PI / 2);
    return [newX, newY];
  };

  const pointAsString = (point: number[]) => point.join(' ');
  const scale = (point: number[], scalar: number) => point.map((x) => scalar * x);

  const getNextPoints = (role: string) => {
    const percentage = roleStats[role].people / allMembers.length;
    const theta = 2 * Math.PI * percentage;

    const arcPoint1 =
      role === chartSection ? scale(previousPoint, chartHoverRadius / chartRadius) : previousPoint;

    totalAngle += theta;
    const arcPoint2 = polarToRect(
      totalAngle,
      role === chartSection ? chartHoverRadius : chartRadius
    );

    const nextPoint = polarToRect(totalAngle, chartRadius);
    const textLocation = polarToRect((2 * totalAngle - theta) / 2, (3 * chartRadius) / 4);
    previousPoint = nextPoint;

    return [arcPoint1, arcPoint2, textLocation];
  };

  return (
    <svg height={height} width={width} viewBox="-200 -200 400 400">
      {Object.keys(roleStats).map((role) => {
        const percentage = roleStats[role].people / allMembers.length;
        const theta = 2 * Math.PI * percentage;
        const currentRadius = role === chartSection ? chartHoverRadius : chartRadius;
        const [point1, point2, textLocation] = getNextPoints(role);
        return (
          <g
            key={role}
            onMouseEnter={() => setChartSection(role)}
            onMouseLeave={() => setChartSection(undefined)}
          >
            <path
              d={`M 0 0 L ${pointAsString(point1)} A ${currentRadius} ${currentRadius} 0 ${
                theta > Math.PI ? `1` : `0`
              } 1 ${pointAsString(point2)} L 0 0`}
              fill={roleStats[role].color}
            />
            <text
              x={textLocation[0]}
              y={textLocation[1]}
              className={`font-bold text-lg ${
                role === 'developer' || role === 'lead' ? 'fill-white' : 'fill-black'
              }`}
              style={{ textAnchor: 'middle' }}
            >
              {`${Math.round(percentage * 100)}%`}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const TeamStatistics = () => {
  const [chartSection, setChartSection] = useState<string | undefined>(undefined);
  const { width } = useScreenSize();

  const allMembers = FA23Members.members as IdolMember[];

  const countMajors = (role?: string) =>
    allMembers.reduce((acc, val) => {
      if (!role || role === (getGeneralRole(val.role) as string)) {
        if (val.major) acc.add(val.major.trim());
        if (val.doubleMajor) acc.add(val.doubleMajor.trim());
      }
      return acc;
    }, new Set());

  const emptyRoleStats: roleStatistics = {
    designer: {
      name: 'Design',
      color: '#FFBCBC',
      people: 0,
      majors: new Set(),
      colleges: new Set()
    },
    developer: {
      name: 'Development',
      color: '#D63D3D',
      people: 0,
      majors: new Set(),
      colleges: new Set()
    },
    pm: { name: 'Product', color: '#FFFFFF', people: 0, majors: new Set(), colleges: new Set() },
    business: {
      name: 'Business',
      color: '#B7B7B7',
      people: 0,
      majors: new Set(),
      colleges: new Set()
    },
    lead: { name: 'Leads', color: '#484848', people: 0, majors: new Set(), colleges: new Set() }
  };

  const roleStats = populateObject(emptyRoleStats, (key, value) => {
    const count = allMembers.filter((mem) => key === (getGeneralRole(mem.role) as string)).length;
    return { ...value, people: count, majors: countMajors(key) as Set<string> };
  });

  return (
    <div className="flex md:flex-row xs:flex-col items-center justify-between lg:ml-6 relative z-10">
      <div className="flex">
        <div className="flex md:flex-col xs:flex-row lg:gap-y-10 md:gap-y-[30px]">
          <div className="text-center md:pl-10 xs:w-1/3 md:border-l-red-600 md:border-2 border-transparent">
            <h1 className="font-semibold lg:text-[52px] md:text-[40px] xs:text-[32px]">
              {chartSection ? roleStats[chartSection].people : allMembers.length}
            </h1>
            <p className="lg:text-[22px] md:text-lg text-[#E4E4E4] xs:text-sm">Members</p>
          </div>
          <div className="text-center md:pl-10 xs:w-1/3 border-l-red-600 border-2 border-transparent">
            <h1 className="font-semibold lg:text-[52px] md:text-[40px] xs:text-[32px]">
              {chartSection ? roleStats[chartSection].majors.size : countMajors().size}
            </h1>
            <p className="lg:text-[22px] md:text-lg text-[#E4E4E4] xs:text-sm">Different majors</p>
          </div>
          <div className="text-center md:pl-10 xs:w-1/3 border-l-red-600 border-2 border-transparent">
            <h1 className="font-semibold lg:text-[52px] md:text-[40px] xs:text-[32px]">7</h1>
            <p className="lg:text-[22px] md:text-lg text-[#E4E4E4] xs:text-sm">
              Represented colleges
            </p>
          </div>
        </div>
      </div>
      <div>
        <PieChart
          width={width >= LAPTOP_BREAKPOINT ? 400 : 300}
          height={width >= LAPTOP_BREAKPOINT ? 400 : 300}
          chartSection={chartSection}
          setChartSection={setChartSection}
          allMembers={allMembers}
          roleStats={roleStats}
        />
      </div>
      <div className="grid md:grid-cols-1 xs:grid-cols-2 md:gap-8 xs:gap-2 md:ml-5 lg:ml-10">
        {Object.keys(roleStats).map((role) => {
          if (role === 'tpm' || role === 'dev-advisor') return <></>;
          return (
            <div
              key={role}
              className="flex lg:gap-7 xs:gap-4 md:gap-[25px] items-center"
              onMouseEnter={() => setChartSection(role)}
              onMouseLeave={() => setChartSection(undefined)}
            >
              <div
                className={`min-w-10 rounded-xl border-[6px] border-[${roleStats[role].color}]`}
                style={{
                  borderColor: roleStats[role].color,
                  minWidth: width >= TABLET_BREAKPOINT ? 40 : 24
                }}
              />
              <p
                className={`lg:text-[22px] md:text-lg font-bold ${
                  chartSection === role ? 'text-white' : 'text-[#877B7B]'
                }`}
              >
                {roleStats[role].name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TeamAbout = () => (
  <div className="relative flex justify-center text-white bg-black overflow-hidden">
    <RedBlob intensity={0.6} className="left-[-200px] top-[200px]" />
    <div
      className="flex flex-col gap-12 xs:mx-4 xs:my-[60px]  md:mx-10 md:my-24 
    lg:m-[70px_100px] xl:m-[115px_240px] 2xl:my-[115px] max-w-5xl relative z-10"
    >
      <div className="flex flex-col items-center xs:gap-[30px_0px]">
        <div className="flex md:flex-row xs:flex-col justify-between gap-[30px] items-center">
          <div className="flex flex-col md:w-1/2 gap-6">
            <h1 className="font-semibold text-[32px]">We are Cornell DTI</h1>
            <p className="md:text-lg xs:text-sm">
              Founded in 2017, DTI is a project team of{' '}
              <span className="font-bold">
                80+ designers, developers, product managers, and business members
              </span>{' '}
              passionate about making change on campus and beyond.
            </p>
          </div>
          <div className={`${ibm_plex_mono.className} text-sm`}>
            <p className="text-left mb-3">@2022</p>
            <Image
              src="/images/full-team.png"
              alt="2022 DTI Team"
              width={490}
              height={370}
              className="rounded-[23px] lg:w-[490px] md:w-[383px] xs:w-[350px] h-auto"
            />
          </div>
        </div>
        <div className={`${ibm_plex_mono.className} text-sm relative w-fit xl:bottom-[84px]`}>
          <p className="mb-3 text-sm">@2017</p>
          <Image
            src="/images/dti_2017.png"
            alt="2022 DTI Team"
            width={453}
            height={305}
            className="rounded-[23px] lg:w-[490px] md:w-[383px] xs:w-[350px] h-auto"
          />
        </div>
      </div>
      <RedBlob intensity={0.7} className="right-[-500px] top-[600px]" />
      <div className="lg:w-2/3 md:w-full mt-[63px] relative z-10">
        <h1 className="font-semibold mb-4 text-[32px]">Who we are</h1>
        <p className="text-lg leading-6">
          More than just being inclusive, our team strives to{' '}
          <span className="font-bold">bring many backgrounds and perspectives together</span> to
          solve community problems. These statistics come from recruiting across campus and seeking
          applicants with the best skills and potential for growth on the team. Updated Fall 2023.
        </p>
      </div>
      <TeamStatistics />
      <RedBlob intensity={0.6} className="bottom-[-100px] left-[-400px]" />
    </div>
  </div>
);
export default TeamAbout;
