'use client';

import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { MemberCard, MemberDetailsCard } from '../TeamCard';
import useClickOutside from '../../hooks/useClickOutside';
import useScreenSize from '../../hooks/useScreenSize';
import useIsMobile from '../../hooks/useIsMobile';
import SectionSep from '../SectionSep';

type Props = {
  courseStaff: IdolMember[];
};

export default function CourseStaffSection({ courseStaff }: Props) {
  const [selectedMember, setSelectedMember] = useState<IdolMember | undefined>(undefined);
  const memberDetailsRef = useRef<HTMLDivElement>(null);
  const { width } = useScreenSize();
  const isMobile = useIsMobile(width);
  const isCompactLayout = width < 800;

  useClickOutside({
    refs: [memberDetailsRef],
    ignoredClassNames: ['card-clickable'],
    onClickOutside: () => setSelectedMember(undefined)
  });

  useEffect(() => {
    setSelectedMember(undefined);
  }, [isMobile]);

  return (
    <>
      <div
        className={`flex w-full border-t-1 border-border-1 ${isMobile ? 'flex-col' : 'flex-row'}`}
      >
        {courseStaff.map((member) => (
          <React.Fragment key={member.netid}>
            <MemberCard
              user={member}
              image={`/team/teamHeadshots/${member.netid}.jpg`}
              selected={selectedMember === member}
              onClick={() => setSelectedMember(member)}
              className={`w-full ${isMobile ? '' : 'w-1/3'}`}
            />

            {isMobile && selectedMember?.netid === member.netid && (
              <div className="border-t-1 border-border-1">
                <SectionSep
                  grid={true}
                  hasX={true}
                  isMobile={true}
                  onClickX={() => setSelectedMember(undefined)}
                />
                <div ref={memberDetailsRef}>
                  <MemberDetailsCard
                    user={member}
                    image={`/team/teamHeadshots/${member.netid}.jpg`}
                    showImage={false}
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Desktop view: render below the full row */}
      {!isMobile && selectedMember && (
        <div className="border-t-1 border-border-1">
          <div className="" ref={memberDetailsRef}>
            <SectionSep
              grid={true}
              hasX={true}
              isMobile={isCompactLayout}
              onClickX={() => setSelectedMember(undefined)}
            />
            <MemberDetailsCard
              user={selectedMember}
              image={`/team/teamHeadshots/${selectedMember.netid}.jpg`}
            />
          </div>
        </div>
      )}
    </>
  );
}
