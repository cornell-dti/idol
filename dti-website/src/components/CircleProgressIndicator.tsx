import { ReactNode, useState, useEffect, useRef } from 'react';
import DonutGraph from './DonutGraph';

type Props = { readonly percentage?: number; readonly children: ReactNode };

export default function CircleProgressIndicator({ percentage = 0, children }: Props): JSX.Element {
  const [currentPercentage, setCurrentPercentage] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | -1>(-1);

  useEffect(() => {
    const currentInterval = intervalRef.current;
    if (currentInterval !== -1) {
      clearInterval(currentInterval);
    }

    intervalRef.current = setInterval(() => {
      const diff = Math.abs(percentage - currentPercentage);

      if (diff <= 0.005) {
        clearInterval(currentInterval as NodeJS.Timeout);

        setCurrentPercentage(percentage);
      } else if (currentPercentage < percentage) {
        setCurrentPercentage((p) => p + Math.min(0.01, diff));
      } else {
        setCurrentPercentage((p) => p - Math.min(0.01, diff));
      }
    }, 5);
  }, [currentPercentage, percentage]);

  return (
    <div className="circle-progress-indicator">
      <div className="circle-progress">
        <div className="circle">
          <div className="mask full">
            <DonutGraph
              id="diversityWheel"
              width={300}
              height={300}
              outerRadius={150}
              innerRadius={135}
              data={{ female: currentPercentage, male: 1 - currentPercentage }}
            />
          </div>
        </div>
        <div className="inset">
          <div className="inset-content">{children}</div>
        </div>
      </div>
    </div>
  );
}
