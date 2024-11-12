/**
 * `RedBlob` Component - Renders a stylized red blob element with customizable position and intensity.
 *
 * @remarks
 * This component renders a large, rounded red blob with a radial gradient, which can be positioned
 * dynamically based on the `className` prop and have varying intensity (opacity) based on the `intensity` prop.
 *
 * @safelist
 * To ensure TailwindCSS handles dynamically generated position classes like `left-[-150px]` or `top-[-96px]`,
 * safelisting has been added in the `tailwind.config.js` file. This prevents Tailwind from purging these
 * classes during the production build, ensuring the dynamic class names are retained and applied correctly.
 * The safelist uses regular expressions to cover common classes for positioning (`left`, `right`, `top`, `bottom`)
 * with negative values as well (e.g., `-top-96`, `-left-150px`).
 *
 * @param props - Contains:
 *   - `className`: The TailwindCSS class to adjust the positioning and styling of the blob.
 *   - `intensity`: A numeric value between 0.1 and 1.0 that adjusts the opacity of the blob.
 */
const RedBlob: React.FC<{ className?: string; intensity: number }> = ({ className, intensity }) => (
  <div
    className={`absolute h-[600px] w-[600px] rounded-full ${className}`}
    style={{
      backgroundImage: `radial-gradient(rgba(192, 12, 12, ${intensity}) 5%, transparent 75%)`
    }}
  />
);

export default RedBlob;
