import Hero from '../../components/Hero';
import Layout from '../../components/Layout';
import CtaSection from '../../components/CtaSection';
import SectionSep from '../../components/SectionSep';
import LogoBox from '../../components/LogoBox';

export const metadata = {
  title: 'DTI SPONSOR PAGE',
  description: 'DESCRIPTION'
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

      <section className="temporarySection">
        <h4>Become a sponsor! section</h4>
      </section>

      <SectionSep />

      <section className="temporarySection">
        <h4>row of 3 cards section</h4>
      </section>

      <SectionSep />

      <section className="temporarySection">
        <h4>Sponsorship benefits section</h4>
      </section>

      <SectionSep />

      <section>
        <div className="grid min-[1000px]:grid-cols-4">
          <div className="col-span-2 flex items-center justify-center border-b-1 border-border-1 min-[1000px]:p-0 p-8">
            <h2 className="h4 text-center">Thank you to our sponsors!</h2>
          </div>
          {logos.map((logo, index) => (
            <LogoBox key={index} {...logo} fillWidth />
          ))}
        </div>
      </section>

      <SectionSep />

      <CtaSection
        heading="Ready to join?"
        subheading="Be part of something greater today."
        button1Label="Apply to DTI"
        button1Link="/apply"
        button2Label="Meet the team"
        button2Link="/team"
      />

      <SectionSep />
    </Layout>
  );
}
