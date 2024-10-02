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
    if (testimonials.length === 0 || scrollAtEnd) return;

    const slider = sliderRef.current;
    let scrollInterval: NodeJS.Timeout;

    if (slider && !isScrolling) {
      scrollInterval = setInterval(() => {
        const maxScrollLeft = slider.scrollWidth - slider.clientWidth;

        if (slider.scrollLeft < maxScrollLeft) {
          slider.scrollLeft += 2; // Adjust this for the scroll speed
        } else {
          setScrollAtEnd(true); // This is to stop it when it reaches the end
          // slider.scrollLeft = 0 to reset to beginning if needed :)
        }
      }, 25); // Adjust the interval as needed for smoother/faster scrolling
    }

    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
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
