import Marquee from '../../components/Marquee';
import TestimonialCard from '../../components/TestimonialCard';
import testimonialData from './data/testimonialData.json';

export default function PastStudentExperiences() {
  return (
    <section>
      <h2 className="p-4 sm:p-8">Past student experiences</h2>
      <Marquee height={370}>
        {testimonialData.testimonials.map(
          ({ description, profileImage, name, semesterTaken }, i) => (
            <TestimonialCard
              key={i}
              quote={description}
              picture={profileImage}
              name={name}
              date={semesterTaken}
            />
          )
        )}
      </Marquee>
    </section>
  );
}
