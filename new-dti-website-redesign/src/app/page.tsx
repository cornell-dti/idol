import Link from 'next/link';
import Navbar from './components/Navbar';

export default function Home() {
  return (
    <div>
      <Navbar />
      <h2>
        <Link href="/test" className="text-accent-red underline">
          VIEW TEST PAGE
        </Link>
      </h2>
    </div>
  );
}
