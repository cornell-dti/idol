import React from "react";

interface HalfSegmentProps {
  orientation: "left" | "right";
  progress: number; // 0 to 1
  isEdgeGradient?: boolean; // fade out for last edge
}

const HalfSegment: React.FC<HalfSegmentProps> = ({
  orientation,
  progress,
  isEdgeGradient = false,
}) => {
  // Clamp progress to 0–1
  const pct = Math.min(1, Math.max(0, progress));

  // Determine base color based on progress
  const base = pct > 0 ? "bg-red-500" : "bg-gray-300";

  // For the filled part width/height (using inline style so we can scale in either axis)
  const sizeStyle =
    orientation === "left" || orientation === "right"
      ? { width: `${pct * 100}%` }
      : { height: `${pct * 100}%` };

  // From color variable for gradient (can adjust to match your Tailwind theme)
  const fromVar = pct > 0 ? "from-red-500" : "from-gray-300";

  // For the edge gradient case
  const gradientClass = isEdgeGradient
    ? ["bg-gradient-to-b", "md:bg-gradient-to-r", fromVar, "to-transparent"].join(" ")
    : base;

  const containerClasses = [
    "overflow-hidden",
    orientation === "right" ? "md:rounded-l-full rounded-t-full" : "md:rounded-r-full rounded-b-full",
    "w-[3px] h-16 md:w-full md:h-[3px]",
  ].join(" ");

  return (
    <div className={containerClasses}>
      <div
        className={gradientClass}
        style={{
          ...sizeStyle,
          flexShrink: 0,
          flexGrow: 0,
          height: orientation === "right" || orientation === "left" ? "100%" : undefined,
        }}
      />
    </div>
  );
};

export default HalfSegment;
