'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from './ui/button';

const Bottom: React.FC = () => (
  <div className="flex flex-col w-screen h-fit text-white">
    Hello this is a daddy panel
    <div className="flex flex-col h-fit justify-center items-left px-8">
      <div className="text-left w-full pb-3">
        <p className="text-neutral-200 text-xs font-bold uppercase">courses</p>
        <h5 className="text-lg font-semibold">Teaching the Cornell Community</h5>
      </div>
      <div className="flex flex-col h-fit justify-center items-center pb-3">
        <div className="flex flex-row justify-center">
          <Image
            className="w-10 h-auto pr-2"
            src="/icons/new_trends.svg"
            width={58}
            height={58}
            alt="Trends icon"
          />
          <div className="flex flex-col justify-center items-center">
            <h6 className="text-left w-full font-bold">Trends in Web Development</h6>
            <p>Learn about modern industry-leading technologies.</p>
          </div>
        </div>
        <div className="flex flex-row justify-center py-3">
          <Image
            className="w-10 h-auto pr-2"
            src="/icons/propel_icon.svg"
            width={58}
            height={63}
            alt="Propel icon"
          />
          <div className="flex flex-col justify-center items-center">
            <h6 className="text-left w-full font-bold">Propel</h6>
            <p>An incubator program devoted to student ideas.</p>
          </div>
        </div>
      </div>
      <Button className="px-3.5 py-3 w-28 h-10 bg-red-500">Learn More</Button>
    </div>
    <div className="flex flex-col h-fit justify-center items-center">
      Hello this is another child panel
    </div>
  </div>
);

export default Bottom;
