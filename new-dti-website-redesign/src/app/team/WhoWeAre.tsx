'use client';

import React, { useState } from 'react';
import members from './data/all-members.json';
import config from '../../../config.json';
import { getGeneralRole, getColorClass } from '../../utils/memberUtils';
import useScreenSize from '../../hooks/useScreenSize';

const LAPTOP_BREAKPOINT = 948;

const LARGE_CHART_SIZE = 400;
const SMALL_CHART_SIZE = 300;

const chartRadius = 175;
const chartHoverRadius = 190;

type RoleStatistics = {
  [key in GeneralRole]: {
    name: string;
    color: string;
    people: number;
    majors: Set<string>;
    colleges: Set<string>;
  };
};

const countMajors = (members: IdolMember[], role?: GeneralRole): Set<string> =>
  members.reduce((acc, val) => {
    const genRole = getGeneralRole(val.role);
    if (!role || role === genRole) {
      if (val.major) acc.add(val.major.trim());
      if (val.doubleMajor) acc.add(val.doubleMajor.trim());
    }
    return acc;
  }, new Set<string>());

const countColleges = (members: IdolMember[], role?: GeneralRole): Set<string> =>
  members.reduce((acc, val) => {
    const genRole = getGeneralRole(val.role);
    if ((!role || role === genRole) && val.college) {
      acc.add(val.college.trim());
    }
    return acc;
  }, new Set<string>());

const generateRoleStats = (members: IdolMember[]): RoleStatistics => {
  const baseStats: RoleStatistics = {
    lead: { name: 'Leads', color: '#FF575E33', people: 0, majors: new Set(), colleges: new Set() },
    developer: {
      name: 'Development',
      color: '#00CA5133',
      people: 0,
      majors: new Set(),
      colleges: new Set()
    },
    designer: {
      name: 'Design',
      color: '#47A8FF33',
      people: 0,
      majors: new Set(),
      colleges: new Set()
    },
    business: {
      name: 'Business',
      color: '#FF930033',
      people: 0,
      majors: new Set(),
      colleges: new Set()
    },
    pm: { name: 'Product', color: '#C372FC33', people: 0, majors: new Set(), colleges: new Set() }
  };

  return (Object.keys(baseStats) as GeneralRole[]).reduce((acc, role) => {
    const peopleCount = members.filter((mem) => getGeneralRole(mem.role) === role).length;
    acc[role] = {
      ...baseStats[role],
      people: peopleCount,
      majors: countMajors(members, role),
      colleges: countColleges(members, role)
    };
    return acc;
  }, baseStats);
};

const PieChart = ({
  width,
  height,
  chartSection,
  setChartSection,
  roleStats,
  allMembers
}: {
  width: number;
  height: number;
  chartSection: GeneralRole | undefined;
  setChartSection: React.Dispatch<React.SetStateAction<GeneralRole | undefined>>;
  roleStats: RoleStatistics;
  allMembers: IdolMember[];
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

  const getNextPoints = (role: GeneralRole) => {
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
    <svg
      height={height}
      width={width}
      viewBox="-200 -200 400 400"
      className="max-w-full max-h-full"
    >
      {Object.keys(roleStats).map((roleKey) => {
        const role = roleKey as GeneralRole;
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
            <path
              d={`M ${pointAsString(point1)} A ${currentRadius} ${currentRadius} 0 ${
                theta > Math.PI ? `1` : `0`
              } 1 ${pointAsString(point2)}`}
              fill="none"
              stroke={getColorClass(roleKey as Role).replace('accent-', 'var(--accent-')}
              strokeWidth="1"
              strokeLinecap="round"
            />
            <line
              x1="0"
              y1="0"
              x2={polarToRect(totalAngle - 0.003, currentRadius)[0]}
              y2={polarToRect(totalAngle - 0.003, currentRadius)[1]}
              stroke={getColorClass(roleKey as Role).replace('accent-', 'var(--accent-')}
              strokeWidth="1"
            />
            <line
              x1="0"
              y1="0"
              x2={polarToRect(totalAngle - theta + 0.003, currentRadius)[0]}
              y2={polarToRect(totalAngle - theta + 0.003, currentRadius)[1]}
              stroke={getColorClass(roleKey as Role).replace('accent-', 'var(--accent-')}
              strokeWidth="1"
            />
            <text
              x={textLocation[0]}
              y={textLocation[1]}
              className={`font-bold text-xl ${getColorClass(roleKey as Role).replace('accent-', 'fill-accent-')}`}
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

export default function WhoWeAre() {
  const [chartSection, setChartSection] = useState<GeneralRole | undefined>(undefined);
  const allMembers = members as IdolMember[];
  const { width } = useScreenSize();
  const roleStats = generateRoleStats(allMembers);

  const chartSize =
    (width ?? LAPTOP_BREAKPOINT) >= LAPTOP_BREAKPOINT ? LARGE_CHART_SIZE : SMALL_CHART_SIZE;

  return (
    <section>
      <div className="flex flex-col gap-2 p-8 border-b border-[var(--color-border-1)]">
        <h2>Who we are</h2>
        <p className="text-foreground-3">
          More than just being inclusive, our team strives to bring many backgrounds and
          perspectives together solve community problems. These statistics come from recruiting
          across campus and seeking applicants with the best skills and potential for growth on the
          team. Updated {config.semester}.
        </p>
      </div>
      <div
        className="flex md:flex-row flex-col items-center justify-between"
        style={{ border: 'none !important' }}
      >
        <div className="md:basis-1/4 flex md:flex-col flex-row flex-wrap w-full max-w-full">
          <div className="text-left p-2 md:p-8 basis-1/3 min-w-0 border-r border-b border-[var(--color-border-1)]">
            <h1>{chartSection ? roleStats[chartSection].people : allMembers.length}</h1>
            <p className="text-foreground-3 md:hidden">Members</p>
            <h5 className="text-foreground-3 hidden md:block">Members</h5>
          </div>
          <div className="text-left p-2 md:p-8 basis-1/3 min-w-0 border-r border-b border-[var(--color-border-1)]">
            <h1>
              {chartSection ? roleStats[chartSection].majors.size : countMajors(allMembers).size}
            </h1>
            <p className="text-foreground-3 md:hidden">Different Majors</p>
            <h5 className="text-foreground-3 hidden md:block">Different Majors</h5>
          </div>
          <div className="text-left p-2 md:p-8 basis-1/3 min-w-0 md:border-r border-b md:border-b-0 border-[var(--color-border-1)]">
            <h1>
              {chartSection
                ? roleStats[chartSection].colleges.size
                : countColleges(allMembers).size}
            </h1>
            <p className="text-foreground-3 md:hidden">Represented Colleges</p>
            <h5 className="text-foreground-3 hidden md:block">Represented Colleges</h5>
          </div>
        </div>
        <div className="md:basis-1/2 flex justify-center items-center self-stretch md:border-b-0 border-b border-[var(--color-border-1)]">
          <PieChart
            width={chartSize}
            height={chartSize}
            chartSection={chartSection}
            setChartSection={setChartSection}
            roleStats={roleStats}
            allMembers={allMembers}
          />
        </div>

        <div className="md:basis-1/4 p-4 md:p-8 flex flex-col gap-4 self-stretch justify-center md:border-l border-[var(--color-border-1)]">
          {(Object.keys(roleStats) as GeneralRole[]).map((role) => {
            const rawRole = allMembers.find((mem) => getGeneralRole(mem.role) === role)?.role;
            return (
              <div
                key={role}
                className="flex gap-4 items-center"
                onMouseEnter={() => setChartSection(role)}
                onMouseLeave={() => setChartSection(undefined)}
              >
                <div
                  className={`w-8 h-8 rounded-sm border-[1px] flex-shrink-0 ${getColorClass(rawRole as Role).replace('accent-', 'border-accent-')}`}
                  style={{
                    backgroundColor: roleStats[role].color
                  }}
                />
                <h5
                  className={`${
                    chartSection === role
                      ? getColorClass(rawRole as Role).replace('accent-', 'text-accent-')
                      : 'text-foreground-3'
                  }`}
                >
                  {roleStats[role].name}
                </h5>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
