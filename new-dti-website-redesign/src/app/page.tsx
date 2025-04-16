import Link from 'next/link';
import Layout from './components/Layout';

export const metadata = {
  title: 'DIT HOMEPAGE',
  description: 'DESCRIPTION'
};

export default function Home() {
  return (
    <>
      <Layout>
        <section className="bg-background-2 h-[400px]">
          <h1>Welcome</h1>
          <p className="mt-2">testing testing 123</p>
        </section>

        <section className="bg-background-3 h-[400px]">
          <h2>
            <Link href="/test-components" className="text-accent-red underline">
              View and test components
            </Link>
          </h2>
        </section>
      </Layout>
    </>
  );
}
