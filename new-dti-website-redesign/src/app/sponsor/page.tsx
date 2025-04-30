import Hero from '@/components/Hero';
import Layout from '../../components/Layout';

export const metadata = {
  title: 'DTI SPONSOR PAGE',
  description: 'DESCRIPTION'
};

export default function Sponsor() {
  return (
    <Layout>
      <Hero
        heading="Support our team"
        subheading="The generous contributions of our supporters and sponsors allow our team to continue building products and hosting initiatives."
        button1Label="Donate to DTI"
        button1Link="https://securelb.imodules.com/s/1717/giving/interior.aspx?sid=1717&gid=2&pgid=16421&bledit=1&dids=2215"
        button2Label="Get in touch"
        button2Link="/"
        image="/sponsor/hero.png"
        imageAlt="DTI members collaborating together in front of a laptop"
      />

      <section className="bg-background-3 h-[800px]">
        <h2>title</h2>
        <p className="mt-2">This is the SPONSOR page</p>
      </section>
      <section className="bg-border-2 h-[800px]">
        <h2>title</h2>

        <p className="mt-2">This is the SPONSOR page</p>
      </section>
    </Layout>
  );
}
