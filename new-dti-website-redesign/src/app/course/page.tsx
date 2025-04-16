import Layout from '../components/Layout';

export const metadata = {
  title: 'DTI COURSE PAGE',
  description: 'DESCRIPTION'
};

export default function Course() {
  return (
    <Layout>
      <section className="bg-background-2 h-[400px]">
        <h1>Course</h1>
        <p className="mt-2">This is the COURSE page</p>
      </section>
      <section className="bg-background-3 h-[800px]">
        <h2>title</h2>
        <p className="mt-2">This is the COURSE page</p>
      </section>
      <section className="bg-border-2 h-[800px]">
        <h2>title</h2>

        <p className="mt-2">This is the COURSE page</p>
      </section>
    </Layout>
  );
}
