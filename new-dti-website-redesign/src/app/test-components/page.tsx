'use client';

import Link from 'next/link';
import Image from 'next/image';

import Button from '../../components/Button';
import IconButton from '../../components/IconButton';
import Input from '../../components/Input';
import LabeledInput from '../../components/LabeledInput';
import TestimonialCard from '../../components/TestimonialCard';
import IconWrapper from '../../components/IconWrapper';
import FeatureCard from '../../components/FeatureCard';
import Chip from '../../components/Chip';
import Tabs from '../../components/Tabs';
import { MemberCard, MemberDetailsCard } from '../../components/TeamCard';
import TimelineCard, { RecruitmentEvent } from '../../components/TimelineCard';

export default function TestComponents() {
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

  return (
    <div className="p-32 flex flex-col gap-16">
      <Link href="/" className="text-accent-red underline">
        Back
      </Link>

      <h3 className="text-accent-blue">Test page with styles + components:</h3>

      <h2 className="text-accent-purple">
        NOTE: this page will soon be deprecated in favor of the
        <Link href="/design-system" className="text-accent-red underline">
          Design System library
        </Link>
        !
      </h2>

      <div className="flex flex-col gap-8">
        <h4>Typography</h4>
        <h1>Building the Future of Tech @ Cornell</h1>
        <h2>Building the Future of Tech @ Cornell</h2>
        <h3>Building the Future of Tech @ Cornell</h3>
        <h4>Building the Future of Tech @ Cornell</h4>
        <h5>Building the Future of Tech @ Cornell</h5>
        <h6>Building the Future of Tech @ Cornell</h6>
        <p>Building the Future of Tech @ Cornello</p>
        <p className="small">Building the Future of Tech @ Cornell</p>
        <p className="caps">Building the Future of Tech @ Cornell</p>
        <p className="caps small">Building the Future of Tech @ Cornell</p>
      </div>

      <div className="flex flex-col gap-6">
        <h4>Colors</h4>
        <div className="flex gap-4">
          <div className="bg-background-1 w-24 h-24 rounded-md border border-border-1"></div>
          <div className="bg-background-2 w-24 h-24 rounded-md"></div>
          <div className="bg-background-3 w-24 h-24 rounded-md"></div>
        </div>

        <div className="flex gap-4">
          <div className="bg-foreground-1 w-24 h-24 rounded-md"></div>
          <div className="bg-foreground-2 w-24 h-24 rounded-md"></div>
          <div className="bg-foreground-3 w-24 h-24 rounded-md"></div>
        </div>

        <div className="flex gap-4">
          <div className="bg-border-1 w-24 h-24 rounded-md"></div>
          <div className="bg-border-2 w-24 h-24 rounded-md"></div>
        </div>

        <div className="flex gap-4">
          <div className="bg-accent-red w-24 h-24 rounded-md"></div>
          <div className="bg-accent-green w-24 h-24 rounded-md"></div>
          <div className="bg-accent-blue w-24 h-24 rounded-md"></div>
          <div className="bg-accent-yellow w-24 h-24 rounded-md"></div>
          <div className="bg-accent-purple w-24 h-24 rounded-md"></div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h4>Buttons</h4>
        <div className="flex gap-4">
          <Button label="Apply today" />

          <Button label="Apply" badge="12D 2H" />

          <Button label="Apply today" variant="secondary" />

          <Button label="Apply today" variant="tertiary" />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h4>Icon buttons</h4>
        <div className="flex gap-4">
          <IconButton aria-label="Create">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-plus-icon lucide-plus"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </IconButton>
          <IconButton aria-label="Create" variant="secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-plus-icon lucide-plus"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </IconButton>
          <IconButton aria-label="Create" variant="tertiary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-plus-icon lucide-plus"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </IconButton>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h4>Inputs</h4>
        <div className="flex gap-8">
          <Input placeholder="Input placeholder" onChange={() => {}} className="w-128" />

          <Input
            placeholder="Input placeholder"
            onChange={() => {}}
            multiline
            height={256}
            className="w-128"
          />
        </div>

        <div className="flex gap-8">
          <LabeledInput
            className="w-128"
            label="Input label"
            inputProps={{
              onChange: () => {},
              placeholder: 'Input placeholder'
            }}
          />

          <LabeledInput
            className="w-128"
            label="Input label"
            inputProps={{
              onChange: () => {},
              placeholder: 'Input placeholder',
              multiline: true,
              height: 256
            }}
          />
        </div>

        <div className="flex gap-8">
          <LabeledInput
            className="w-128"
            label="Input label"
            inputProps={{
              onChange: () => {},
              placeholder: 'Input placeholder'
            }}
            error="Input error message"
          />

          <LabeledInput
            className="w-128"
            label="Input label"
            inputProps={{
              onChange: () => {},
              placeholder: 'Input placeholder',
              multiline: true,
              height: 256
            }}
            error="Input error message"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h4>Testimonial cards</h4>
        <div className="flex gap-4">
          <TestimonialCard
            quote="This course was really helpful and enjoyable. The lessons were clear and easy to follow, and I learned a lot about web development. The project especially helped put everything together. I'd recommend it to anyone looking to learn web development!"
            picture="/clem.jpg"
            name="Clément Rozé"
            date="Fall 2024"
          />
          <TestimonialCard
            quote="Trends in Web Development has been an incredibly valuable course, equipping me with practical skills and knowledge that will greatly benefit my future career. The final project was a rewarding experience, allowing me to put my new skills into practice and create a project I'm proud of!"
            picture="/juju.png"
            name="Juju Crane"
            date="Fall 2024"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h4>Icon wrappers</h4>
        <div className="flex gap-4">
          <IconWrapper size="large" type="primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-rocket-icon lucide-rocket"
            >
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
            </svg>
          </IconWrapper>

          <IconWrapper size="default" type="primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-rocket-icon lucide-rocket"
            >
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
            </svg>
          </IconWrapper>

          <IconWrapper size="small" type="primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-rocket-icon lucide-rocket"
            >
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
            </svg>
          </IconWrapper>
        </div>

        <div className="flex gap-4">
          <IconWrapper size="large" type="default">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-rocket-icon lucide-rocket"
            >
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
            </svg>
          </IconWrapper>

          <IconWrapper size="default" type="default">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-rocket-icon lucide-rocket"
            >
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
            </svg>
          </IconWrapper>

          <IconWrapper size="small" type="default">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-rocket-icon lucide-rocket"
            >
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
            </svg>
          </IconWrapper>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h4>Feature Card</h4>
        <div className="grid grid-cols-1 md:grid-cols-3">
          <FeatureCard
            title="Card Title"
            body="Some more details here. Should be about 2 or 3 lines. Lorem ipsum dolor, sit amet ducet. One more and done."
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-rocket-icon lucide-rocket"
              >
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
              </svg>
            }
          />

          <FeatureCard
            title="Card Title"
            body="Some more details here. Should be about 2 or 3 lines. Lorem ipsum dolor, sit amet ducet. One more and done."
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-rocket-icon lucide-rocket"
              >
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
              </svg>
            }
          />

          <FeatureCard
            title="Card Title"
            body="Some more details here. Should be about 2 or 3 lines. Lorem ipsum dolor, sit amet ducet. One more and done."
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-rocket-icon lucide-rocket"
              >
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
              </svg>
            }
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h4>Chip</h4>
        <div className="flex gap-4">
          <Chip label="Coming soon" />

          <Chip label="Coming soon" color="red" />

          <Chip label="Coming soon" color="green" />

          <Chip label="Coming soon" color="blue" />

          <Chip label="Coming soon" color="yellow" />

          <Chip label="Coming soon" color="purple" />
        </div>

        <h4>Tab</h4>
        <Tabs
          tabs={[
            {
              label: 'Tab 1',
              content: (
                <div className="w-128 h-128 bg-accent-blue p-8 focusState" tabIndex={0}>
                  <h3>Tab panel 1</h3>

                  <p>A lovely tab 1 with just an image</p>

                  <Image src="/clem.jpg" alt="Clément's pic" width={128} height={128} />
                </div>
              )
            },
            {
              label: 'Tab 2',
              content: (
                <div className="w-128 h-128 bg-accent-yellow p-8">
                  <h3>Tab panel 2</h3>

                  <p>A lovely tab 2 with interactive elements</p>

                  <Input placeholder="Input placeholder" onChange={() => {}} className="w-64" />

                  <Button label="Hey hey" variant="secondary" />
                </div>
              )
            },
            {
              label: 'Tab 3',
              content: (
                <div className="w-128 h-128 bg-accent-red p-8 focusState" tabIndex={0}>
                  <h3>Tab panel 3</h3>
                  <p className="small caps">helloooo</p>
                </div>
              )
            }
          ]}
        />
      </div>
      <div className="flex flex-col gap-6">
        <h4>Member Cards</h4>
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
      </div>
      <div className="flex flex-col gap-6">
        <h4>Timeline Card</h4>
        <div className="flex flex-col gap-4">
          <TimelineCard event={mockEvent} cycle="freshmen" />
          <TimelineCard event={{ ...mockEvent, location: undefined }} cycle="freshmen" />
          <TimelineCard
            event={{ ...mockEvent, link: undefined, location: 'Upson 102' }}
            cycle="freshmen"
          />
        </div>
      </div>
    </div>
  );
}
