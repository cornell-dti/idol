import React from 'react';
import FeatureCard from '../../components/FeatureCard';
import HeartIcon from '../../components/icons/HeartIcon';
import TrendUpIcon from '../../components/icons/TrendUpIcon';
import GlobeIcon from '../../components/icons/GlobeIcon';

const stats = [
  { value: '80+', label: 'Active Members' },
  { value: '20+', label: 'Majors Represented' },
  { value: '7k+', label: 'Monthly App Users' }
];

export default function SponsorFeatures() {
  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-3">
        <FeatureCard
          title="Build relationships"
          body="We help organizations create a diverse talent pipeline, present information sessions, conduct workshops, and help establish a presence on Cornell's campus."
          icon={<HeartIcon />}
        />
        <FeatureCard
          title="Help us thrive"
          body="Your contributions are crucial in helping the DTI community grow and maintain its vibrant culture. You can make a direct impact on the Cornell experience!"
          icon={<TrendUpIcon />}
        />
        <FeatureCard
          title="Make an impact"
          body="Through software licenses, community outreach, marketing, and more, funds help us grow our vision of helping our the community."
          icon={<GlobeIcon />}
        />
      </section>
      <section aria-label="Our community in numbers" className="grid grid-cols-1 md:grid-cols-3">
        {stats.map((stat) => (
          <article key={stat.label} className="flex flex-col gap-1 p-4 sm:p-8">
            <h3 className="h1 text-accent-red">{stat.value}</h3>
            <p className="text-foreground-3 !text-[20px]">{stat.label}</p>
          </article>
        ))}
      </section>
    </>
  );
}
