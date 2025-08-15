'use client';

import React, { useState } from 'react';
import members from './data/all-members.json';
import config from '../../../config.json';
import { getGeneralRole, getColorClass } from '../../utils/memberUtils';
import { LAPTOP_BREAKPOINT } from '../../consts';
import useScreenSize from '../../hooks/useScreenSize';

const LARGE_CHART_SIZE = 400;
const SMALL_CHART_SIZE = 300;

const BORDER_ANGLE_OFFSET = 0.003;

const CHART_RADIUS = 175;
const CHART_HOVER_RADIUS = 190;

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
    lead: {
      name: 'Leads',
      color: getColorClass('ops-lead', true, true),
      people: 0,
      majors: new Set(),
      colleges: new Set()
    },
    developer: {
      name: 'Development',
      color: getColorClass('developer', true, true),
      people: 0,
      majors: new Set(),
      colleges: new Set()
    },
    designer: {
      name: 'Design',
      color: getColorClass('designer', true, true),
      people: 0,
      majors: new Set(),
      colleges: new Set()
    },
    business: {
      name: 'Business',
      color: getColorClass('business', true, true),
      people: 0,
      majors: new Set(),
      colleges: new Set()
    },
    pm: {
      name: 'Product',
      color: getColorClass('pm', true, true),
      people: 0,
      majors: new Set(),
      colleges: new Set()
    }
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
  roleStats,
  allMembers,
  setChartSection
}: {
  width: number;
  height: number;
  chartSection: GeneralRole | undefined;
  roleStats: RoleStatistics;
  allMembers: IdolMember[];
  setChartSection: React.Dispatch<React.SetStateAction<GeneralRole | undefined>>;
}) => {
  let previousPoint = [0, -CHART_RADIUS];
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
      role === chartSection
        ? scale(previousPoint, CHART_HOVER_RADIUS / CHART_RADIUS)
        : previousPoint;

    totalAngle += theta;
    const arcPoint2 = polarToRect(
      totalAngle,
      role === chartSection ? CHART_HOVER_RADIUS : CHART_RADIUS
    );

    const nextPoint = polarToRect(totalAngle, CHART_RADIUS);
    const textLocation = polarToRect((2 * totalAngle - theta) / 2, (3 * CHART_RADIUS) / 4);
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
        const currentRadius = role === chartSection ? CHART_HOVER_RADIUS : CHART_RADIUS;
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
              style={{
                transition: '0.2s ease-in-out'
              }}
            />
            <path
              d={`M ${pointAsString(point1)} A ${currentRadius} ${currentRadius} 0 ${
                theta > Math.PI ? `1` : `0`
              } 1 ${pointAsString(point2)}`}
              fill="none"
              stroke={getColorClass(roleKey as Role, false, true)}
              strokeWidth="1"
              strokeLinecap="round"
              style={{
                transition: '0.2s ease-in-out'
              }}
            />
            <path
              d={`M 0 0 L ${polarToRect(totalAngle - BORDER_ANGLE_OFFSET, currentRadius)[0]} ${polarToRect(totalAngle - BORDER_ANGLE_OFFSET, currentRadius)[1]}`}
              stroke={getColorClass(roleKey as Role, false, true)}
              strokeWidth="1"
              fill="none"
              style={{
                transition: '0.2s ease-in-out'
              }}
            />
            <path
              d={`M 0 0 L ${polarToRect(totalAngle - theta + BORDER_ANGLE_OFFSET, currentRadius)[0]} ${polarToRect(totalAngle - theta + BORDER_ANGLE_OFFSET, currentRadius)[1]}`}
              stroke={getColorClass(roleKey as Role, false, true)}
              strokeWidth="1"
              fill="none"
              style={{
                transition: '0.2s ease-in-out'
              }}
            />
            <text
              x={textLocation[0]}
              y={textLocation[1]}
              className={`font-bold text-xl ${getColorClass(roleKey as Role, false, false, 'fill-accent')}`}
              style={{ textAnchor: 'middle' }}
              aria-label={`${Math.round(percentage * 100)}% of our members are in ${roleStats[role].name.toLowerCase()}`}
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
      <div className="flex flex-col gap-2 p-4 sm:p-8 border-b border-border-1">
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
          <div className="text-left p-4 sm:p-8 basis-1/3 min-w-0 border-r border-b border-border-1">
            <h3 className="h1">
              {chartSection ? roleStats[chartSection].people : allMembers.length}
            </h3>
            <p className="text-foreground-3 sm:!text-[20px]">Members</p>
          </div>
          <div className="text-left p-4 sm:p-8 basis-1/3 min-w-0 border-r border-b border-border-1">
            <h3 className="h1">
              {chartSection ? roleStats[chartSection].majors.size : countMajors(allMembers).size}
            </h3>
            <p className="text-foreground-3 sm:!text-[20px]">Different majors</p>
          </div>
          <div className="text-left p-4 sm:p-8 basis-1/3 min-w-0 md:border-r border-b md:border-b-0 border-border-1">
            <h3 className="h1">
              {chartSection
                ? roleStats[chartSection].colleges.size
                : countColleges(allMembers).size}
            </h3>
            <p className="text-foreground-3 sm:!text-[20px]">Represented colleges</p>
          </div>
        </div>
        <div className="md:basis-1/2 flex justify-center items-center self-stretch md:border-b-0 border-b border-border-1">
          <PieChart
            width={chartSize}
            height={chartSize}
            chartSection={chartSection}
            roleStats={roleStats}
            allMembers={allMembers}
            setChartSection={setChartSection}
          />
        </div>

        {/* We don't need screenreaders to announce this legend because the pie chart already has aria-labels */}
        <div
          className="md:basis-1/4 p-4 sm:p-8 flex flex-col gap-4 self-stretch justify-center md:border-l border-border-1"
          aria-hidden
        >
          {(Object.keys(roleStats) as GeneralRole[]).map((role) => {
            const rawRole = allMembers.find((mem) => getGeneralRole(mem.role) === role)?.role;
            return (
              <div
                key={role}
                className="flex gap-4 items-center group "
                onMouseEnter={() => setChartSection(role)}
                onMouseLeave={() => setChartSection(undefined)}
              >
                <div
                  className={`w-8 h-8 rounded-sm border-1 flex-shrink-0 transition-opacity ${getColorClass(rawRole as Role, false, false, 'border-accent')}`}
                  style={{
                    backgroundColor: roleStats[role].color,
                    opacity: chartSection === role ? 1 : 0.5
                  }}
                />
                <h3
                  className={`h6 transition-colors ${
                    chartSection === role
                      ? getColorClass(rawRole as Role, false, false, 'text-accent')
                      : 'text-foreground-3'
                  }`}
                >
                  {roleStats[role].name}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
