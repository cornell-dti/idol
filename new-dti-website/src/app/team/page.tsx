'use client';

import TeamHero from '../../../components/team/TeamHero';
import TeamAbout from '../../../components/team/TeamAbout';
import MemberDisplay from '../../../components/team/MemberDisplay';
import TeamFooter from '../../../components/team/TeamFooter';
import useTitle from '../../hooks/useTitle';

const TeamPage = () => {
  useTitle('Team');
  return (
    <>
      <TeamHero />
      <TeamAbout />
      <MemberDisplay />
      <TeamFooter />
    </>
  );
};

export default TeamPage;
