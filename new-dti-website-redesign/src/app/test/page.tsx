import Link from 'next/link';

export default function TestPage() {
  return (
    <div className="p-32 flex flex-col gap-16">
      <Link href="/" className="text-accent-red underline">
        Back
      </Link>

      <h3 className="text-accent-blue">TEST PAGE WITH STYLES & COMPONENTS:</h3>

      <div className="flex flex-col gap-8">
        <h1>Building the Future of Tech @ Cornell</h1>
        <h2>Building the Future of Tech @ Cornell</h2>
        <h3>Building the Future of Tech @ Cornell</h3>
        <h4>Building the Future of Tech @ Cornell</h4>
        <h5>Building the Future of Tech @ Cornell</h5>
        <h6>Building the Future of Tech @ Cornell</h6>
        <p>Building the Future of Tech @ Cornello</p>
        <p className="small">Building the Future of Tech @ Cornell</p>
        <p className="caps">Building the Future of Tech @ Cornell</p>
        <p className="caps small">Building the Future of Tech @ Cornell</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex gap-4">
          <div className="bg-background-1 w-24 h-24 rounded-md border border-border-1"></div>
          <div className="bg-background-2 w-24 h-24 rounded-md"></div>
          <div className="bg-background-3 w-24 h-24 rounded-md"></div>
        </div>

        <div className="flex gap-4">
          <div className="bg-foreground-1 w-24 h-24 rounded-md"></div>
          <div className="bg-foreground-2 w-24 h-24 rounded-md"></div>
          <div className="bg-foreground-3 w-24 h-24 rounded-md"></div>
        </div>

        <div className="flex gap-4">
          <div className="bg-border-1 w-24 h-24 rounded-md"></div>
          <div className="bg-border-2 w-24 h-24 rounded-md"></div>
        </div>

        <div className="flex gap-4">
          <div className="bg-accent-red w-24 h-24 rounded-md"></div>
          <div className="bg-accent-green w-24 h-24 rounded-md"></div>
          <div className="bg-accent-blue w-24 h-24 rounded-md"></div>
          <div className="bg-accent-yellow w-24 h-24 rounded-md"></div>
          <div className="bg-accent-purple w-24 h-24 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
