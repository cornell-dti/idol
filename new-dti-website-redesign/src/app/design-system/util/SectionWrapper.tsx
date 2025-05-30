interface SectionWrapperProps {
  children: React.ReactNode;
}

export default function SectionWrapper({ children }: SectionWrapperProps) {
  return <div className="border-1 border-border-1">{children}</div>;
}
