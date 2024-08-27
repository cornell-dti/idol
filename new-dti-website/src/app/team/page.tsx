'use client';

import TeamHero from '../../../components/team/TeamHero';
import MemberDisplay from '../../../components/team/MemberDisplay';
import TeamAlumni from '../../../components/team/TeamAlumni';
import TeamAbout from '../../../components/team/TeamAbout';

const TeamPage = () => (
  <>
    <TeamHero />
    <TeamAbout />
    <MemberDisplay />
    <TeamAlumni />;
  </>
);

export default TeamPage;
