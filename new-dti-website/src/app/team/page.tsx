'use client';

import TeamAbout from '../../../components/team/TeamAbout';
import MemberDisplay from '../../../components/team/MemberDisplay';
import TeamFooter from '../../../components/team/TeamFooter';
import useTitle from '../../hooks/useTitle';
import Hero from '../../../components/hero';
import Banner from '@/components/apply/Banner';

const TeamPage = () => {
  useTitle('Team');
  return (
    <div className="relative">
      <Banner
        message={"It's Giving Day – click here to support DTI and make a gift!"}
        variant={'accent'}
        link={'https://givingday.cornell.edu/campaigns/cornell-digital-tech-innovation'}
      />
      <Hero
        title={'Working together'}
        description={
          'We are Cornell DTI. But individually, we are a talented, diverse group of students from different colleges and countries striving to make a difference in the Cornell community and beyond.'
        }
        image={{
          src: '/images/about-hero.png',
          alt: 'DTI students posing in front of Gates Hall'
        }}
      />
      <TeamAbout />
      <MemberDisplay />
      <TeamFooter />
    </div>
  );
};

export default TeamPage;
