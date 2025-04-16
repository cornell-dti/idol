import Link from 'next/link';
import Navbar from './components/Navbar';
import Layout from './components/Layout';

export const metadata = {
  title: 'DIT HOMEPAGE',
  description: 'DESCRIPTION'
};

export default function Home() {
  return (
    <>
      <Layout>
        <section aria-labelledby="hero">
          <h1>Welcome</h1>
          <p className="mt-2">testing testing 123</p>
        </section>

        <h2>
          <Link href="/test" className="text-accent-red underline">
            View Test Page
          </Link>
        </h2>
      </Layout>
    </>
  );
}
