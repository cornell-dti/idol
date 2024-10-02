import React, { useRef, useState, useEffect } from 'react';
import TestimonialCard, { TestimonialCardProps } from './TestimonialCard';

interface TestimonialSliderProps {
  testimonials: TestimonialCardProps[];
}

export default function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollAtEnd, setScrollAtEnd] = useState(false);

  useEffect(() => {
    // Ensure the return value is always consistent (cleanup function)
    if (testimonials.length === 0 || scrollAtEnd) return;

    const slider = sliderRef.current;
    if (!slider || isScrolling) return;

    const scrollInterval = setInterval(() => {
      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;

      if (slider.scrollLeft < maxScrollLeft) {
        slider.scrollLeft += 2; // Adjust the scroll speed as needed
      } else {
        setScrollAtEnd(true); // Stop scrolling when the end is reached :)
        // slider.scrollLeft = 0 if you want it to restart at the beginning
      }
    }, 25); // Adjust the interval as needed for smoother/faster scrolling

    return () => clearInterval(scrollInterval); // Cleanup function
  }, [testimonials, isScrolling, scrollAtEnd]);

  const handleMouseEnter = () => {
    setIsScrolling(true);
  };

  const handleMouseLeave = () => {
    setIsScrolling(false);
  };

  return (
    <div
      className="overflow-x-auto pt-14"
      ref={sliderRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex gap-x-12 px-10 sm:px-32 flex-nowrap">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            description={testimonial.description}
            name={testimonial.name}
            semesterTaken={testimonial.semesterTaken}
          />
        ))}
      </div>
    </div>
  );
}
