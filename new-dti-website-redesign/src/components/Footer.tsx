'use client'
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/team', label: 'Team' },
        { href: '/products', label: 'Products' },
        { href: '/course', label: 'Course' },
        { href: '/initiatives', label: 'Initiatives' },
        { href: '/sponsor', label: 'Sponsor' },
        { href: '/apply', label: 'Apply' },
    ];
    const NavLinksSection = () => (
        <div>
            <h6 className="text-foreground-1 pb-[8px]">Cornell DTI</h6>
            <ul className="flex flex-col list-none">
                {navLinks.map(({ href, label }) => (
                    <li key={href}>
                        <Link
                            href={href}
                            className="text-foreground-3 hover:text-foreground-1"
                        >
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
    return (
        <div className="bg-background-1">
            <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-4 gap-0">
                {/* Logo section */}
                <div className="p-8">
                    <Image
                        src="/logo.svg"
                        alt="Cornell Digital Tech & Innovation logo"
                        width={220}
                        height={50}
                        className="min-w-[100px]"
                    />
                </div>

                {/* Cornell DTI section */}
                <div className="p-8">
                    <NavLinksSection />
                </div>


                {/* Products section */}
                <div className="p-8">
                    <h6 className="font-semibold mb-4">Products</h6>
                </div>

                {/* Button section */}
                <div className="p-8">
                    <h6 className="font-semibold mb-4">Button</h6>
                </div>
            </div>
            <div className="hidden sm:grid sm:grid-cols-2 md:hidden">
                <div className="grid grid-rows-2">
                    <div className="p-8 h-40">
                        <h6 className="font-semibold mb-4">Logo</h6>
                    </div>
                    <div className="p-8">
                        <NavLinksSection />
                    </div>
                </div>

                <div className="grid grid-rows-2">
                    <div className="p-8 h-40">
                        <h6 className="font-semibold mb-4">Button</h6>
                    </div>
                    <div className="p-8">
                        <h6 className="font-semibold mb-4">Products</h6>
                    </div>
                </div>
            </div>
            <div className="sm:hidden flex flex-col p-4">
                {/* Logo section */}
                <div className="">
                    <h6 className="">Logo</h6>
                </div>

                {/* Cornell DTI section */}
                <div className="pb-8 pt-8">
                    <NavLinksSection />
                </div>

                {/* Products section with button */}
                <div className="">
                    <h6 className="">Products</h6>

                    {/* Button positioned at bottom right */}
                </div>
            </div>
        </div>
    )

}