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
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollAtEnd, setScrollAtEnd] = useState(false);

  useEffect(() => {
    const slider = sliderRef.current;

    // Return early if there are no testimonials or if we've reached the end
    if (!slider || testimonials.length === 0 || scrollAtEnd || isScrolling) {
      return undefined; // Return `undefined` explicitly to satisfy consistent-return rule
    }

    const scrollInterval = setInterval(() => {
      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;

      if (slider.scrollLeft < maxScrollLeft) {
        slider.scrollLeft += 1; // Adjust the scroll speed as needed
      } else {
        setScrollAtEnd(true); // Stop scrolling when the end is reached
        // slider.scrollLeft = 0 if we want to start from the begnning :)
      }
    }, 40); // Adjust the interval as needed for smoother/faster scrolling

    // Return the cleanup function
    return () => {
      clearInterval(scrollInterval);
    };
  }, [testimonials, isScrolling, scrollAtEnd]);

  const handleMouseEnter = () => {
    setIsScrolling(true);
  };

  const handleMouseLeave = () => {
    setIsScrolling(false);
  };

  return (
    <div
      className={`overflow-x-auto pt-14 ${className}`}
      ref={sliderRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex gap-x-12 flex-nowrap">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            profileImage={testimonial.profileImage}
            description={testimonial.description}
            name={testimonial.name}
            semesterTaken={testimonial.semesterTaken}
          />
        ))}
      </div>
    </div>
  );
}
