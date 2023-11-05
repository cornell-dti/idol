import React, { useState, useEffect, useRef } from 'react';

interface FocusProps {
  icon: string;
  title: string;
  description: string;
}

const Focus: React.FC<FocusProps> = ({
  icon,
  title,
  description,
}) => {
  const [isBright, setIsBright] = useState(false);
  const FocusRef = useRef<HTMLDivElement>(null);

  const checkPosition = () => {
    const refCurrent = FocusRef.current;
    if (refCurrent) {
      const { top, bottom } = refCurrent.getBoundingClientRect();
      const vpHeight = window.innerHeight || document.documentElement.clientHeight;
      setIsBright(top < vpHeight / 2 && bottom > vpHeight / 2);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', checkPosition);
    checkPosition();

    return () => {
      window.removeEventListener('scroll', checkPosition);
    };
  }, []);

  return (
    <div className="focus-area-component" ref={FocusRef}>
      <img
        src={icon}
        alt={`${title} icon`}
        style={{ opacity: isBright ? 1 : 0.7 }}
      />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default Focus;
