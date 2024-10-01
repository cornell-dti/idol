import React from 'react';

interface TestimonialCardProps {
  description: string;
  name: string;
  semesterTaken: string;
}

/**
 * `TestimonialCard` Component - Displays a single testimonial from a student who has done Trends.
 *
 * @remarks
 * This component is used to present testimonials from students about their experiences taking the course. It showcases
 * a brief description of the testimonial, the name of the student (or anonymous), and the semester in which they took the class.
 *
 * @param props - Contains:
 *   - `description`: The student's written testimonial about the course.
 *   - `name`: The name of the student who gave the testimonial, or "Anonymous" if the student prefers not to disclose their name.
 *   - `semesterTaken`: The semester when the student took the course.
 */
export default function TestimonialCard({
  description,
  name,
  semesterTaken
}: TestimonialCardProps) {
  return (
    <div className="bg-white max-w-md w-[800px] p-10 rounded-xl drop-shadow-sm flex-shrink-0">
      <div className="text-3xl text-gray-800 mb-4 tracking-wider font-black">❛❛</div>
      <p className="text-lg text-gray-700 mb-6">{description}</p>
      <div className="text-gray-900 font-bold pt-8">{name}</div>
      <div className="text-gray-500">{semesterTaken}</div>
    </div>
  );
}
