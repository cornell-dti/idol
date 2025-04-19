import Layout from '../components/Layout';

export const metadata = {
  title: 'DTI TEAM PAGE',
  description: 'DESCRIPTION'
};

export default function Team() {
  return (
    <Layout>
      <section className="bg-background-2 h-[400px]">
        <h1>Team</h1>
        <p className="mt-2">This is the team page</p>
      </section>
      <section className="bg-background-3 h-[800px]">
        <h2>title</h2>
        <p className="mt-2">This is the team page</p>
      </section>
      <section className="bg-border-2 h-[800px]">
        <h2>title</h2>

        <p className="mt-2">This is the team page</p>
      </section>
    </Layout>
  );
}
