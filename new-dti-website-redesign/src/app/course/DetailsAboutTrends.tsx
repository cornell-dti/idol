import React from 'react';
import Timeline from '../../components/course/Timeline';
import FeatureCard from '../../components/FeatureCard';
import RocketIcon from '../design-system/components/icon/RocketIcon';

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
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
              <path d="m15 5 4 4" />
            </svg>
          }
        />
        <FeatureCard
          title="Deploy"
          body="Learn how to deploy your web applications ot the cloud using service provider such as Heroku or the Google Cloud Platform."
          icon={<RocketIcon />}
        />
        <FeatureCard
          title="Final Project"
          body="The class ends with a final project project consolidating all class topics, which can be used on your resume or portfolio."
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 7.75a.75.75 0 0 1 1.142-.638l3.664 2.249a.75.75 0 0 1 0 1.278l-3.664 2.25a.75.75 0 0 1-1.142-.64z" />
              <path d="M12 17v4" />
              <path d="M8 21h8" />
              <rect x="2" y="3" width="20" height="14" rx="2" />
            </svg>
          }
        />
      </div>
    </section>
  );
}
