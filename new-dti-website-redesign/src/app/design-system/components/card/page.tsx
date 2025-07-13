'use client';

import React, { useEffect, useRef, useState } from 'react';
import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import TestimonialCard from '../../../../components/TestimonialCard';
import FeatureCard from '../../../../components/FeatureCard';
import Marquee from '../../../../components/Marquee';
import RocketIcon from '../../../../components/icons/RocketIcon';
import TimelineCard, { RecruitmentEvent } from '../../../../components/TimelineCard';
import { MemberCard, MemberDetailsCard } from '../../../../components/TeamCard';
import PeopleIcon from '@/components/icons/PeopleIcon';
import FileIcon from '@/components/icons/FileIcon';
import GlobeIcon from '@/components/icons/GlobeIcon';
import Note from '../../util/Note';
import InfoIcon from '@/components/icons/InfoIcon';
import PlusIcon from '@/components/icons/PlusIcon';
import LoudspeakerIcon from '@/components/icons/LoudspeakerIcon';
import ChatIcon from '@/components/icons/ChatIcon';
import SectionSep from '@/components/SectionSep';
import rawMembers from '../../../team/data/all-members.json';
import useIsMobile from '../../../../hooks/useIsMobile';
import useScreenSize from '../../../../hooks/useScreenSize';

const features = [
  {
    title: 'A11Y Matters',
    body: 'Accessibility ensures everyone can use your product, improving inclusivity and user experience.',
    icon: <GlobeIcon />
  },
  {
    title: 'Inclusive Design',
    body: 'Designing for accessibility means creating products that work for people of all abilities.',
    icon: <PeopleIcon />
  },
  {
    title: 'Legal & Ethical',
    body: 'Accessibility helps meet legal standards and reflects a commitment to ethical, responsible design.',
    icon: <FileIcon />
  }
];

const testimonials = [
  {
    quote:
      "Cornell DTI has shown me that designing a product isn't only about making it look pretty -- it's about solving real problems with thoughtful, user-centered solutions.",
    picture: '/team/teamHeadshots/cpr58.jpg',
    name: 'Clément Rozé',
    date: 'Designer & Developer'
  },
  {
    quote:
      'DTI gave me hands-on experience in product design, allowing me to apply my creativity to real-world problems. Collaborating with engineers and designers helped me refine my UX/UI skills and better understand user needs. The team environment pushed me to think critically about design decisions and iterate effectively based on feedback.',
    picture: '/team/teamHeadshots/zw757.jpg',
    name: 'May Wu',
    date: 'Designer'
  },
  {
    quote:
      "DTI has helped me develop two skills more valuable than just plain software engineering: teamwork & leadership. Whether through subteam meetings, role work seshes, dev-design handoffs, or being a part of the leadership team, I've been able to learn so much and am infinitely grateful for the opportunity.",
    picture: '/team/teamHeadshots/sci24.jpg',
    name: 'Simon Ilincev',
    date: 'Developer Lead'
  },
  {
    quote:
      'Cornell Digital Tech & Innovation has allowed me to give back to the Cornell community by being directly involved in shaping product vision for a range of super impactful products (and alongside a team of fantastic individuals)!',
    picture: '/team/teamHeadshots/may52.jpg',
    name: 'Megan Yap',
    date: 'Product Lead'
  },
  {
    quote:
      'Cornell Digital Tech & Innovation has given me the opportunity to learn about the product development cycle from beginning to end, and take on multiple roles as a leader and engineer throughout!',
    picture: '/team/teamHeadshots/ajq22.jpg',
    name: 'Andrew Qian',
    date: 'Full Team Lead'
  },
  {
    quote:
      'Cornell DTI has given me the opportunity to explore so many facets of tech, hone my practice of industry-standard design, and meet so many amazing, talented people with a similar passion to drive innovative impact!',
    picture: '/team/teamHeadshots/el728.jpg',
    name: 'Erica Lee',
    date: 'Designer'
  },
  {
    quote:
      'DTI has helped me learn so much about product design, both as a discipline and in practice, and helped me grow both professionally and personally. The best part has been connecting with so many talented people who share my passion for innovating meaningful impact!',
    picture: '/team/teamHeadshots/rcd239.jpg',
    name: 'Renee Du',
    date: 'Designer'
  }
];

const events: RecruitmentEvent[] = [
  {
    icon: <LoudspeakerIcon />,
    title: 'Applications open!',
    description:
      "We're welcoming any and all students who are looking to make a difference through tech. Applicants are not considered on a rolling basis.",
    location: 'Application Link',
    type: 'application',
    link: '/apply',
    freshmen: { date: 'TBD', isTentative: false, time: 'TBD' },
    upperclassmen: { date: 'TBD', isTentative: false },
    spring: { date: 'TBD', isTentative: true }
  },
  {
    icon: <InfoIcon />,
    title: 'Information sessions',
    description:
      "We'll have a few sessions to learn about DTI, our goals, and our subteams. There's also time to chat with DTI members of all roles after.",
    location: undefined,
    type: 'application',
    link: undefined,
    freshmen: { date: 'TBD', isTentative: false, time: 'TBD' },
    upperclassmen: { date: 'TBD', isTentative: false },
    spring: { date: 'TBD', isTentative: false }
  },
  {
    icon: <ChatIcon />,
    title: 'Interviews',
    description:
      'Prepare to talk about past experiences and your motivation for joining DTI. Then, demonstrate your technical skills through problem-solving challenges relevant to your subteam.',
    location: 'TBD',
    type: 'application',
    link: undefined,
    freshmen: { date: 'TBD', isTentative: false, time: 'TBD' },
    upperclassmen: { date: 'TBD', isTentative: false },
    spring: { date: 'TBD', isTentative: false }
  }
];

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
  const members = rawMembers as IdolMember[];

  const testimonialNetIDs = [
    'cpr58', // Clément Rozé
    'zw757', // May Wu
    'sci24', // Simon Ilincev
    'may52', // Megan Yap
    'ajq22', // Andrew Qian
    'el728', // Erica Lee
    'rcd239', // Renee Du
    'jlc565' // Juju Crane
  ];

  const [selectedMember, setSelectedMember] = useState<IdolMember | undefined>(undefined);

  const testimonialMembers = members.filter((member: IdolMember) =>
    testimonialNetIDs.includes(member.netid)
  );

  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedMember && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedMember]);

  const columns = 4;
  const rows = [];

  for (let i = 0; i < testimonialMembers.length; i += columns) {
    rows.push(testimonialMembers.slice(i, i + columns));
  }

  // const cardRefs = useRef<{ [netid: string]: HTMLTitleElement | null }>({});

  // useEffect(() => {
  //   if (selectedMember?.netid && cardRefs.current[selectedMember.netid]) {
  //     cardRefs.current[selectedMember.netid]?.scrollIntoView({
  //       behavior: 'smooth',
  //       block: 'start'
  //     });
  //   }
  // }, [selectedMember]);

  const cardRefs = useRef<{ [netid: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (selectedMember?.netid && cardRefs.current[selectedMember.netid]) {
      cardRefs.current[selectedMember.netid]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [selectedMember]);

  const { width } = useScreenSize();
  const isMobile = useIsMobile(width);

  return (
    <PageLayout title="Card">
      <PageSection title="Feature card" description="Typically arranged in a row of 3 cards.">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} title={feature.title} body={feature.body} icon={feature.icon} />
          ))}
        </div>
      </PageSection>

      <PageSection title="Testimonial card" description="Used to show a person's quote.">
        {testimonials.slice(0, 2).map(({ quote, picture, name, date }, index) => (
          <TestimonialCard key={index} quote={quote} picture={picture} name={name} date={date} />
        ))}

        <Note text="You can also arrange them in a carousel." />

        <Marquee height={370}>
          {testimonials.map(({ quote, picture, name, date }, index) => (
            <TestimonialCard key={index} quote={quote} picture={picture} name={name} date={date} />
          ))}
        </Marquee>
      </PageSection>

      <PageSection title="Timeline card" description="Used on the timeline in the 'Apply' page.">
        {events.map((event, index) => (
          <TimelineCard key={index} event={event} cycle="freshmen" />
        ))}
      </PageSection>

      <PageSection
        title="Team card"
        description="Used to display information about a team member in the 'Team' and 'Course' pages."
      >
        <div className="flex flex-col">
          {rows.map((rowMembers, rowIndex) => {
            const isSelectedInRow = rowMembers.some((m) => m.netid === selectedMember?.netid);
            return (
              <React.Fragment key={rowIndex}>
                <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
                  {rowMembers.map((member) => (
                    <MemberCard
                      key={member.netid}
                      user={member}
                      image={`/team/teamHeadshots/${member.netid}.jpg`}
                      selected={selectedMember?.netid === member.netid}
                      onClick={() =>
                        setSelectedMember((prev) =>
                          prev?.netid === member.netid ? undefined : member
                        )
                      }
                      className="card-clickable"
                      ref={(el) => {
                        cardRefs.current[member.netid] = el;
                      }}
                    />
                  ))}
                </div>

                {isSelectedInRow && selectedMember && (
                  <div>
                    <SectionSep
                      grid
                      hasX
                      onClickX={() => setSelectedMember(undefined)}
                      xAriaLabel={`Close ${selectedMember.firstName} ${selectedMember.lastName}'s profile`}
                    />
                    <MemberDetailsCard
                      user={selectedMember}
                      image={`/team/teamHeadshots/${selectedMember.netid}.jpg`}
                      showImage={!isMobile} // ✅ This is the new logic
                    />
                    <SectionSep grid />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </PageSection>
    </PageLayout>
  );
}
