import Image from 'next/image';
import Hero from '../../components/Hero';
import Layout from '../../components/Layout';
import CtaSection from '../../components/CtaSection';
import SectionSep from '../../components/SectionSep';
import LogoBox from '../../components/LogoBox';
import FeatureCard from '../../components/FeatureCard';

export const metadata = {
  title: 'Sponsor - Cornell DTI',
  description: "Support Cornell DTI to fuel student innovation and tech education, while connecting with top talent and building your brand."
};

const logos = [
  { src: '/sponsor/logos/google.svg', alt: 'Google logo', width: 130, height: 42 },
  { src: '/sponsor/logos/asana.svg', alt: 'Asana logo', width: 190, height: 74 },
  { src: '/sponsor/logos/zeplin.svg', alt: 'Zeplin logo', width: 200, height: 100 },
  { src: '/sponsor/logos/capital-one.svg', alt: 'Capital One logo', width: 172, height: 60 },
  { src: '/sponsor/logos/invision.svg', alt: 'InVision logo', width: 155, height: 52 },
  { src: '/sponsor/logos/millennium.svg', alt: 'Millennium logo', width: 206, height: 32 }
];

export default function Sponsor() {
  return (
    <Layout>
      <Hero
        heading="Support our team"
        subheading="The generous support of our sponsors enables us to keep building products and leading initiatives."
        button1Label="Donate to DTI"
        button1Link="https://securelb.imodules.com/s/1717/giving/interior.aspx?sid=1717&gid=2&pgid=16421&bledit=1&dids=2215"
        button2Label="Get in touch"
        button2Link="/"
        image="/sponsor/hero.png"
      />

      <section>
        <Image
          src="/sponsor/become-a-sponsor.png"
          width={1184}
          height={600}
          alt="A DTI information session presenting the project team"
        />

        <div className="flex flex-col gap-2 p-8 border-t-1 border-border-1">
          <h2 className="h3">Become a sponsor!</h2>

          <p className="text-foreground-2">
            We would love to partner with organizations that share our vision of changing the world.
            Together, we can harness the power of technology to drive change in our communities.
          </p>
        </div>
      </section>

      <SectionSep />

      <section className="grid grid-cols-1 md:grid-cols-3">
        <FeatureCard
          title="Build relationships"
          body="We help organizations create a diverse talent pipeline, present information sessions, conduct workshops, and help establish a presence on Cornell's campus."
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-heart-icon lucide-heart"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          }
        />
        <FeatureCard
          title="Help us thrive"
          body="Your contributions are crucial in helping the DTI community grow and maintain its vibrant culture. You can make a direct impact on the Cornell experience!"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-trending-up-icon lucide-trending-up"
            >
              <path d="M16 7h6v6" />
              <path d="m22 7-8.5 8.5-5-5L2 17" />
            </svg>
          }
        />
        <FeatureCard
          title="Make an impact"
          body="Through software licenses, community outreach, marketing, and more, funds help us grow our vision of helping our the community."
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-earth-icon lucide-earth"
            >
              <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" />
              <path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17" />
              <path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          }
        />
      </section>

      <SectionSep />

      <section className="temporarySection">
        <h4>Sponsorship benefits section</h4>
      </section>

      <SectionSep />

      <section>
        <div className="grid min-[1000px]:grid-cols-4">
          <div className="col-span-2 flex items-center justify-center min-[1000px]:p-0 p-8 border-b-1 border-border-1">
            <h2 className="h4 text-center">Thank you to our sponsors!</h2>
          </div>
          {logos.map((logo, index) => (
            <LogoBox
              key={index}
              {...logo}
              fillWidth
              // remove left border on 3rd logo
              // remove bottom border on 3rd to 6th logos
              className={`border-l border-b border-border-1 
              ${index === 2 ? '!border-l-0' : ''} 
              ${index >= 2 && index <= 5 ? '!border-b-0' : ''}`}
            />
          ))}
        </div>
      </section>

      <CtaSection
        heading="Ready to join?"
        subheading="Be part of something greater today."
        button1Label="Apply to DTI"
        button1Link="/apply"
        button2Label="Meet the team"
        button2Link="/team"
      />
    </Layout>
  );
}
