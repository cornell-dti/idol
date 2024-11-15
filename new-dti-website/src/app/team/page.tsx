'use client';

import TeamHero from '../../../components/team/TeamHero';
import TeamAbout from '../../../components/team/TeamAbout';
import MemberDisplay from '../../../components/team/MemberDisplay';
import TeamAlumni from '../../../components/team/TeamAlumni';
import useThemeContext from '../../hooks/useThemeContext';

const TeamPage = () => {
  const { theme } = useThemeContext();
  theme?.setFooterTheme('light');
  return (
    <>
      <TeamHero />
      <TeamAbout />
      <MemberDisplay />
      <TeamAlumni />
    </>
  );
};

export default TeamPage;
