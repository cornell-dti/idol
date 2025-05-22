import React from 'react';
import PageLayout from '../../PageLayout';
import PageSection from '../../PageSection';
import TestimonialCard from '../../../../components/TestimonialCard';
import FeatureCard from '../../../../components/FeatureCard';
import Marquee from '../../../../components/Marquee';
import RocketIcon from '../icon/RocketIcon';

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
        <p className="caps text-accent-green">COMING SOON</p>
      </PageSection>

      <PageSection title="Team card" description="Use in the 'Team' page">
        <p className="caps text-accent-green">COMING SOON</p>
      </PageSection>
    </PageLayout>
  );
}
