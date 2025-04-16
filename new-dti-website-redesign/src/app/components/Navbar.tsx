import Link from 'next/link';
import Button from './Button';

export default function Navbar() {
  return (
    <nav className="flex justify-between p-16 max-w-[1184px] m-auto bg-accent-blue">
      <p>Logo</p>

      <div className="flex gap-8">
        <ul className="flex gap-4">
          <li>
            <Link href="/">Home</Link>
          </li>

          <li>
            <Link href="/team">Team</Link>
          </li>

          <li>
            <Link href="/products">Products</Link>
          </li>
        </ul>

        <Button variant="primary" href="/apply" label="Apply" />
      </div>
    </nav>
  );
}
