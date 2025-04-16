import Link from 'next/link';
import Button from './Button';

export default function Navbar() {
  return (
    <nav className="flex justify-between p-16 max-w-[1184px] mx-4 md:mx-32 sm:mx-8 lg:mx-auto bg-background-1">
      <Link href="/">Logo home</Link>

      <div className="flex gap-8">
        <ul className="flex gap-4">
          <li>
            <Link href="/team">Team</Link>
          </li>

          <li>
            <Link href="/products">Products</Link>
          </li>

          <li>
            <Link href="/course">Course</Link>
          </li>

          <li>
            <Link href="/initiatives">Initiatives</Link>
          </li>

          <li>
            <Link href="/sponsor">Sponsor</Link>
          </li>
        </ul>

        <Button variant="primary" href="/apply" label="Apply" />
      </div>
    </nav>
  );
}
