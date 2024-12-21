import React, { useRef, useState, useEffect } from 'react';
import TestimonialCard, { TestimonialCardProps } from './TestimonialCard';

interface TestimonialSliderProps {
  testimonials: TestimonialCardProps[];
  className?: string;
}

export default function TestimonialSlider({
  testimonials,
  className = ''
}: TestimonialSliderProps) {
  return (
    <div className={`w-full inline-flex flex-nowrap ${className}`}>
      <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
        {testimonials.map((testimonial, index) => (
          <li key={index}>
            <TestimonialCard
              profileImage={testimonial.profileImage}
              description={testimonial.description}
              name={testimonial.name}
              semesterTaken={testimonial.semesterTaken}
            />
          </li>
        ))}
      </ul>
      <ul
        className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll"
        aria-hidden="true"
      >
        {testimonials.map((testimonial, index) => (
          <li key={index}>
            <TestimonialCard
              profileImage={testimonial.profileImage}
              description={testimonial.description}
              name={testimonial.name}
              semesterTaken={testimonial.semesterTaken}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
