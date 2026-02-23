import React from 'react';
import Timeline from '../../components/course/Timeline';
import FeatureCard from '../../components/FeatureCard';
import BrainIcon from '../../components/icons/BrainIcon';
import CogIcon from '../../components/icons/CogIcon';
import PresentIcon from '../../components/icons/PresentIcon';

type TimelineEvent = {
  title: string;
  date: string;
  time?: string;
};

interface DetailsAboutProductStrategyProps {
  timelineEvents: TimelineEvent[];
}

export default function DetailsAboutProductStrategy({ timelineEvents }: DetailsAboutProductStrategyProps) {
  return (
    <section>
      <h2 className="p-4 sm:p-8">Details about Product Strategy</h2>
      <Timeline events={timelineEvents} currentDate={new Date()} />
      <div className="grid grid-cols-1 md:grid-cols-3">
        <FeatureCard
          title="Strategy"
          body="We teach you to think like a PM: identify real problems, prioritize effectively, and develop innovative strategies."
          icon={<BrainIcon />}
        />
        <FeatureCard
          title="Hands-On Prototyping"
          body="Bring your product idea to life using AI-assisted prototyping and low-code tools!"
          icon={<CogIcon />}
        />
        <FeatureCard
          title="Final Project"
          body="Complete a final project with a polished product case study and PRD that's ready for your resume, portfolio, and interviews."
          icon={<PresentIcon />}
        />
      </div>
    </section>
  );
}
