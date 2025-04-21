import Layout from '../components/Layout';

export const metadata = {
  title: 'DTI INITIATIVES PAGE',
  description: 'DESCRIPTION'
};

export default function Initiatives() {
  return (
    <Layout>
      <section className="bg-background-2 h-[400px]">
        <h1>INITIATIVES</h1>
        <p className="mt-2">This is the INITIATIVES page</p>
      </section>
      <section className="bg-background-3 h-[800px]">
        <h2>title</h2>
        <p className="mt-2">This is the INITIATIVES page</p>
      </section>
      <section className="bg-border-2 h-[800px]">
        <h2>title</h2>

        <p className="mt-2">This is the INITIATIVES page</p>
      </section>
    </Layout>
  );
}
