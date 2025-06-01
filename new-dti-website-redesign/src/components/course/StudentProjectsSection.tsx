'use client';

import Image from 'next/image';
import FancyTabs from '../FancyTabs/FancyTabs';
import studentProjectData from '../../app/course/data/student_projects.json';
import Button from '../Button';

type Project = {
  title: string;
  description: string;
  imageSrc: string;
  link?: string;
};

export default function StudentProjectsSection() {
  const { student_projects }: { student_projects: Project[] } = studentProjectData;

  const tabs = student_projects.map((project) => ({
    label: project.title,
    content: (
      <div>
        <div className="relative w-full h-[256px] md:h-[582px]">
          <Image src={project.imageSrc} alt={project.title} fill className="object-cover" />
        </div>
        <div className="p-4 flex flex-col gap-2">
          <h3>{project.title}</h3>
          <div className="flex flex-col gap-4">
            <p className="text-foreground-3">{project.description}</p>
            <Button
              label="View project"
              disabled={project.link === undefined}
              href={project.link}
              newTab={true}
            />
          </div>
        </div>
      </div>
    )
  }));

  return <FancyTabs tabs={tabs} />;
}
