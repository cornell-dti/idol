'use client';

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

  useClickOutside({
    refs: [memberDetailsRef],
    ignoredClassNames: ['card-clickable'],
    onClickOutside: () => setSelectedMember(undefined)
  });

  useEffect(() => {
    setSelectedMember(undefined);
  }, [isMobile]);

  return (
    <div>
      <div className={` flex w-full ${isMobile ? 'flex-col' : 'flex-row'}`}>
        {courseStaff.map((member) => (
          <div key={member.netid} className={`w-full ${isMobile ? '' : 'w-1/3'}`}>
            <MemberCard
              user={member}
              image={`/team/teamHeadshots/${member.netid}.jpg`}
              selected={selectedMember === member}
              onClick={() => setSelectedMember(member)}
            />

            {/* Mobile view: render directly under selected card */}
            {isMobile && selectedMember?.netid === member.netid && (
              <div>
                <SectionSep grid={true} hasX={true} isMobile={true} />
                <div ref={memberDetailsRef}>
                  <MemberDetailsCard
                    user={member}
                    image={`/team/teamHeadshots/${member.netid}.jpg`}
                    showImage={false}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop view: render below the full row */}
      {!isMobile && selectedMember && (
        <div>
          <div className="" ref={memberDetailsRef}>
            <SectionSep grid={true} hasX={true} onClickX={() => setSelectedMember(undefined)} />
            <MemberDetailsCard
              user={selectedMember}
              image={`/team/teamHeadshots/${selectedMember.netid}.jpg`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
