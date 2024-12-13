import React, { useState } from 'react';

interface DDProjectsProps {
  title: string;
  description: string;
  imageSrc: string;
}

/**
 * `DDProjects` Component - Displays information about past student Projects within Trends :)
 *
 * @remarks
 * This component is used to present information about student projects, including the title,
 * description, and an image representing the project that they did in Trends class. There is an interactive expand/collapse
 * functionality, allowing the user to toggle additional details with a smooth transition effect.
 * The card's background color changes based on its state (open/closed). The component is also responsive to screen size.
 *
 * The component is designed to receive data via props and a json object.
 *
 * @param props - Contains:
 *   - `title`: The title of the project, displayed prominently at the top of the card.
 *   - `description`: A brief description of the project, revealed when the card is expanded.
 *   - `imageSrc`: The URL for the image that represents the project, displayed in the expanded view.
 */
export default function DDProjects({ title, description, imageSrc }: DDProjectsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCard = () => {
    setIsOpen(!isOpen);
  };

  return (
    <button
      className={`transition-all duration-300 ease-in-out text-left bg-white
         w-full max-w-8xl rounded-xl drop-shadow-sm px-10 py-8 border-1 border-[#E4E4E4]`}
      onClick={toggleCard}
      aria-label={`${isOpen ? 'Minimize' : 'Expand'} ${title} student project`}
    >
      <div className="flex justify-between items-center">
        <h3 className={`md:text-2xl text-lg font-semibold ${isOpen ? 'text-white' : 'text-black'}`}>
          {title}
        </h3>
        <p className={`md:text-3xl text-xl font-thin ${isOpen ? 'text-white' : 'text-gray-700'}`}>
          {isOpen ? '−' : '+'}
        </p>
      </div>

      <div className={`overflow-hidden ${isOpen ? 'opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="mt-4">
          <p className="text-white text-lg">{description}</p>
          <img src={imageSrc} alt={title} className="mt-4 w-full object-cover rounded-lg" />
        </div>
      </div>
    </button>
  );
}
