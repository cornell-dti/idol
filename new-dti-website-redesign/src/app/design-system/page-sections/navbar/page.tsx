import React from 'react';
import PageLayout from '../../PageLayout';
import PageSection from '../../PageSection';
import TestimonialCard from '../../../../components/TestimonialCard';
import FeatureCard from '../../../../components/FeatureCard';
import Marquee from '../../../../components/Marquee';
import RocketIcon from '../icon/RocketIcon';
import TimelineCard, { RecruitmentEvent } from '@/components/TimelineCard';
import { MemberCard, MemberDetailsCard } from '@/components/TeamCard';

const mockEvent: RecruitmentEvent = {
  title: 'Applications open!',
  description:
    "We're welcoming any and all students who are looking to make a difference through tech. Applicants are not considered on a rolling basis.",
  location: 'Application Link',
  type: 'application',
  link: 'https://docs.google.com/forms/d/e/1FAIpQLSc_Tp8BAM0ad-x5GmCRN_YgPOUwRjQynbGLuqQ28932zfwXrg/viewform?usp=sf_link',
  freshmen: { date: 'August 21', isTentative: false, time: '5-6PM' },
  upperclassmen: { date: 'August 21', isTentative: false },
  spring: { date: 'January 3', isTentative: false }
};

const mockUser: IdolMember = {
  netid: 'abc123',
  email: 'abc123@cornell.edu',
  firstName: 'John',
  lastName: 'Doe',
  pronouns: '',
  semesterJoined: '',
  graduation: 'May 2028',
  major: 'Information Science',
  hometown: 'New York, NY',
  about: `According to all known laws of aviation, there is no way that a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyways. Because bees don't care what humans think is impossible.\nCrazy? I Was Crazy Once. They Locked Me In A Room. A Rubber Room. A Rubber Room With Rats. And Rats Make Me Crazy.`,
  subteams: ['idol'],
  role: 'ops-lead',
  roleDescription: 'Full Team Lead',
  doubleMajor: 'Economics',
  linkedin: 'https://www.linkedin.com/',
  github: 'https://github.com/',
  website: 'https://google.com/'
};

export default function CardPage() {
  return (
    <PageLayout title="Card" description="Guidelines for Card component.">
      <PageSection title="Feature card" description="Typically arranged in a row of 3 cards">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} title={feature.title} body={feature.body} icon={feature.icon} />
          ))}
        </div>
      </PageSection>
    </PageLayout>
  );
}
