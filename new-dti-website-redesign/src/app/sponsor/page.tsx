import Image from 'next/image';
import Hero from '../../components/Hero';
import Layout from '../../components/Layout';
import CtaSection from '../../components/CtaSection';
import SectionSep from '../../components/SectionSep';
import SponsorsList from './SponsorsList';
import SponsorFeatures from './SponsorFeatures';
import SponsorTable from './SponsorTable';

export const metadata = {
  title: 'Sponsor - Cornell DTI',
  description:
    'Support Cornell DTI to fuel student innovation and tech education, while connecting with top talent and building your brand.'
};

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

        <div className="flex flex-col gap-2 p-4 sm:p-8 border-t-1 border-border-1">
          <h2 className="h3">Become a sponsor!</h2>

          <p className="text-foreground-3">
            We would love to partner with organizations that share our vision of changing the world.
            Together, we can harness the power of technology to drive change in our communities.
          </p>
        </div>
      </section>

      <SectionSep />

      <SponsorFeatures />

      <SectionSep />

      <SponsorTable />

      <SectionSep />

      <SponsorsList />

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
