const RedBlob: React.FC<{ className?: string; intensity: number }> = ({ className, intensity }) => (
  <div
    className={`absolute h-[600px] w-[600px] rounded-full z-0 ${className}`}
    style={{
      backgroundImage: `radial-gradient(rgba(192, 12, 12, ${intensity}) 5%, transparent 75%)`
    }}
  />
);

export default RedBlob;
