'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import Input from '../components/Input';
import LabeledInput from '../components/LabeledInput';
import TestimonialCard from '../components/TestimonialCard';

const PlusIcon = Plus as React.FC;

export default function TestComponents() {
  return (
    <div className="p-32 flex flex-col gap-16">
      <Link href="/" className="text-accent-red underline">
        Back
      </Link>

      <h3 className="text-accent-blue">TEST PAGE WITH STYLES & COMPONENTS:</h3>

      <div className="flex flex-col gap-8">
        <h4>Typography</h4>
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
        <h4>Colors</h4>
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

      <div className="flex flex-col gap-6">
        <h4>Buttons</h4>
        <div className="flex gap-4">
          <Button label="Apply today" />

          <Button label="Apply" badge="12D 2H" />

          <Button label="Apply today" variant="secondary" />

          <Button label="Apply today" variant="tertiary" />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h4>Icon buttons</h4>
        <div className="flex gap-4">
          <IconButton aria-label="Create">
            <PlusIcon />
          </IconButton>
          <IconButton aria-label="Create" variant="secondary">
            <PlusIcon />
          </IconButton>
          <IconButton aria-label="Create" variant="tertiary">
            <PlusIcon />
          </IconButton>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h4>Inputs</h4>
        <div className="flex gap-8">
          <Input placeholder="Input placeholder" onChange={() => {}} className="w-128" />

          <Input
            placeholder="Input placeholder"
            onChange={() => {}}
            multiline
            height={256}
            className="w-128"
          />
        </div>

        <div className="flex gap-8">
          <LabeledInput
            className="w-128"
            label="Input label"
            inputProps={{
              onChange: () => {},
              placeholder: 'Input placeholder'
            }}
          />

          <LabeledInput
            className="w-128"
            label="Input label"
            inputProps={{
              onChange: () => {},
              placeholder: 'Input placeholder',
              multiline: true,
              height: 256
            }}
          />
        </div>

        <div className="flex gap-8">
          <LabeledInput
            className="w-128"
            label="Input label"
            inputProps={{
              onChange: () => {},
              placeholder: 'Input placeholder'
            }}
            error="Input error message"
          />

          <LabeledInput
            className="w-128"
            label="Input label"
            inputProps={{
              onChange: () => {},
              placeholder: 'Input placeholder',
              multiline: true,
              height: 256
            }}
            error="Input error message"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h4>Testimonial cards</h4>
        <div className="flex gap-4">
          <TestimonialCard
            quote="This course was really helpful and enjoyable. The lessons were clear and easy to follow, and I learned a lot about web development. The project especially helped put everything together. I'd recommend it to anyone looking to learn web development!"
            picture="/clem.jpg"
            name="Clément Rozé"
            date="Fall 2024"
          />
          <TestimonialCard
            quote="Trends in Web Development has been an incredibly valuable course, equipping me with practical skills and knowledge that will greatly benefit my future career. The final project was a rewarding experience, allowing me to put my new skills into practice and create a project I'm proud of!"
            picture="/juju.png"
            name="Juju Crane"
            date="Fall 2024"
          />
        </div>
      </div>
    </div>
  );
}
