'use client';

import TeamHero from '../../../components/team/TeamHero';
import TeamAbout from '../../../components/team/TeamAbout';
import MemberDisplay from '../../../components/team/MemberDisplay';
import TeamFooter from '../../../components/team/TeamFooter';
import useThemeContext from '../../hooks/useThemeContext';

const TeamPage = () => {
  const { theme } = useThemeContext();
  theme?.setFooterTheme('light');
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
