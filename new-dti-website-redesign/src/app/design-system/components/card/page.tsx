import React from 'react';
import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import TestimonialCard from '../../../../components/TestimonialCard';
import FeatureCard from '../../../../components/FeatureCard';
import Marquee from '../../../../components/Marquee';
import RocketIcon from '../icon/RocketIcon';
import TimelineCard, { RecruitmentEvent } from '@/components/TimelineCard';
import { MemberCard, MemberDetailsCard } from '@/components/TeamCard';

const features = [
  {
    title: 'Best Practices',
    body: 'We emphasize best engineering practices for every element, from API design to frontend modularization.',
    icon: <RocketIcon />
  },
  {
    title: 'Deploy',
    body: 'Learn how to deploy your web applications ot the cloud using service provider such as Heroku or the Google Cloud Platform.',
    icon: <RocketIcon />
  },
  {
    title: 'Final Project',
    body: 'The class ends with a final project project consolidating all class topics, which can be used on your resume or portfolio.',
    icon: <RocketIcon />
  }
];

const testimonials = [
  {
    quote:
      "This course was really helpful and enjoyable. The lessons were clear and easy to follow, and I learned a lot about web development. The project especially helped put everything together. I'd recommend it to anyone looking to learn web development!",
    picture: '/clem.jpg',
    name: 'Clément Rozé',
    date: 'Fall 2024'
  },
  {
    quote:
      "Trends in Web Development has been an incredibly valuable course, equipping me with practical skills and knowledge that will greatly benefit my future career. The final project was a rewarding experience, allowing me to put my new skills into practice and create a project I'm proud of!",
    picture: '/juju.png',
    name: 'Juju Crane',
    date: 'Fall 2024'
  }
];

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

      <PageSection
        title="Testimonial card"
        description="Use for when u need to you someone's testimonial"
      >
        {testimonials.map(({ quote, picture, name, date }, index) => (
          <TestimonialCard key={index} quote={quote} picture={picture} name={name} date={date} />
        ))}

        <p>You can also arrange them in a carousel</p>

        <Marquee height={370}>
          {testimonials.map(({ quote, picture, name, date }, index) => (
            <TestimonialCard key={index} quote={quote} picture={picture} name={name} date={date} />
          ))}
        </Marquee>
      </PageSection>

      <PageSection title="Timeline card" description="Use on the timeline in 'Apply' page">
        <TimelineCard event={mockEvent} cycle="freshmen" />
        <TimelineCard event={{ ...mockEvent, location: undefined }} cycle="freshmen" />
        <TimelineCard
          event={{ ...mockEvent, link: undefined, location: 'Upson 102' }}
          cycle="freshmen"
        />
      </PageSection>

      <PageSection title="Team card" description="Use in the 'Team' page">
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <MemberCard
              key={i}
              user={{
                ...mockUser,
                role: ['ops-lead', 'tpm', 'designer', 'business', 'pm-advisor'][i % 5] as Role,
                roleDescription: [
                  'Full Team Lead',
                  'Technical PM',
                  'Designer',
                  'Business',
                  'PM Advisor'
                ][i % 5] as RoleDescription
              }}
              image={'/clem.jpg'}
              selected={i > 4}
            />
          ))}
        </div>

        <MemberDetailsCard user={mockUser} image="/clem.jpg" />
      </PageSection>
    </PageLayout>
  );
}
