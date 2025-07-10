import React from 'react';
import Timeline from '../../components/course/Timeline';
import FeatureCard from '../../components/FeatureCard';
import RocketIcon from '../../components/icons/RocketIcon';
import PencilIcon from '../../components/icons/PencilIcon';
import PresentIcon from '../../components/icons/PresentIcon';

type TimelineEvent = {
  title: string;
  date: string;
  time?: string;
};

interface DetailsAboutTrendsProps {
  timelineEvents: TimelineEvent[];
}

export default function DetailsAboutTrends({ timelineEvents }: DetailsAboutTrendsProps) {
  return (
    <section>
      <h2 className="p-4 sm:p-8">Details about Trends</h2>
      <Timeline events={timelineEvents} currentDate={new Date()} />
      <div className="grid grid-cols-1 md:grid-cols-3">
        <FeatureCard
          title="Best Practices"
          body="We emphasize best engineering practices for every element, from API design to frontend modularization."
          icon={<PencilIcon />}
        />
        <FeatureCard
          title="Deploy"
          body="Learn how to deploy your web applications ot the cloud using service provider such as Heroku or the Google Cloud Platform."
          icon={<RocketIcon />}
        />
        <FeatureCard
          title="Final Project"
          body="The class ends with a final project project consolidating all class topics, which can be used on your resume or portfolio."
          icon={<PresentIcon />}
        />
      </div>
    </section>
  );
}
