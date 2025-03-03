'use client';

import TeamAbout from '../../../components/team/TeamAbout';
import MemberDisplay from '../../../components/team/MemberDisplay';
import TeamFooter from '../../../components/team/TeamFooter';
import useTitle from '../../hooks/useTitle';
import Hero from '../../../components/hero';

const TeamPage = () => {
  useTitle('Team');
  return (
    <>
      <Hero
        title={'Working together'}
        description={
          'We are Cornell DTI. But individually, we are a talented, diverse group of students from different colleges and countries striving to make a difference in the Cornell community and beyond.'
        }
        image={{
          src: '/images/about-hero.png',
          alt: 'TODO'
        }}
      />
      <TeamAbout />
      <MemberDisplay />
      <TeamFooter />
    </>
  );
};

export default TeamPage;
