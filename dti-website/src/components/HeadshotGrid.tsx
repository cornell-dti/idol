import { useState } from 'react';

import HeadshotCard from './HeadshotCard';
import MemberProfileModal from './MemberProfileModal';

type MemberInfo = { readonly id: string; readonly info: Member };

interface PhantomMember {
  id: string;
  phantom: true;
}

type Props = { readonly members: readonly MemberInfo[] };

export default function HeadshotGrid({ members }: Props): JSX.Element {
  const [currentProfile, setCurrentProfile] = useState<MemberInfo | null>(null);

  const pad = (
    original: readonly MemberInfo[]
  ): ReadonlyArray<MemberInfo | PhantomMember> => {
    const copy: Array<MemberInfo | PhantomMember> = [...original];
    const max = 16;
    for (let i = 0; i < max; i += 1) {
      copy.push({ id: `phantom-${i}`, phantom: true });
    }
    return copy;
  };

  return (
    <div className="headshot-grid d-flex flex-row flex-wrap justify-content-start">
      {pad(members).map((member) => (
        <div
          className="flexible-item"
          v-for="member in pad(members)"
          key={member.id}
        >
          {'phantom' in member ? (
            <div className="phantom-headshot-card">
              <HeadshotCard name={member.id} role={member.id} image="" />
            </div>
          ) : (
            <HeadshotCard
              name={member.info.name}
              role={member.info.roleDescription}
              image={`/static/members/${member.info.netid}.jpg`}
              onClick={() => setCurrentProfile(member)}
            />
          )}
        </div>
      ))}
      <MemberProfileModal
        profile={currentProfile as MemberInfo}
        open={currentProfile != null}
        onClose={() => setCurrentProfile(null)}
      />
    </div>
  );
}
