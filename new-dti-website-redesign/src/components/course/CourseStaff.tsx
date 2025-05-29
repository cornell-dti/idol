'use client';

import { useRef, useState } from 'react';
import { MemberCard, MemberDetailsCard } from '../../components/TeamCard';
import useClickOutside from '../../hooks/useClickOutside';

type Props = {
  courseStaff: IdolMember[];
};

export default function CourseStaffSection({ courseStaff }: Props) {
  const [selectedMember, setSelectedMember] = useState<IdolMember | undefined>(undefined);
  const memberDetailsRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    refs: [memberDetailsRef],
    ignoredClassNames: ['card-clickable'],
    onClickOutside: () => setSelectedMember(undefined)
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row w-full">
        {courseStaff.map((member) => (
          <MemberCard
            key={member.netid}
            user={member}
            image={`/team/teamHeadshots/${member.netid}.jpg`}
            selected={selectedMember == member}
            onClick={() => setSelectedMember(member)}
            className="md:w-1/3"
          />
        ))}
      </div>
      {selectedMember && (
        <div className="" ref={memberDetailsRef}>
          <MemberDetailsCard
            user={selectedMember}
            image={`/team/teamHeadshots/${selectedMember.netid}.jpg`}
          />
        </div>
      )}
    </div>
  );
}
