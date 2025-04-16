import Layout from '../components/Layout';

export const metadata = {
  title: 'DTI APPLY PAGE',
  description: 'DESCRIPTION'
};

export default function Apply() {
  return (
    <Layout>
      <section className="bg-background-2 h-[400px]">
        <h1>Apply</h1>
        <p className="mt-2">This is the APPLY page</p>
      </section>
      <section className="bg-background-3 h-[800px]">
        <h2>title</h2>
        <p className="mt-2">This is the apply page</p>
      </section>
      <section className="bg-border-2 h-[800px]">
        <h2>title</h2>

        <p className="mt-2">This is the apply page</p>
      </section>
    </Layout>
  );
}
