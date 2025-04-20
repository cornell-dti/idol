type IconWrapperProps = {
  children: React.ReactNode;
  size?: 'default' | 'small';
  className?: string;
};

export function IconWrapper({ children, size = 'default', className = '' }: IconWrapperProps) {
  const wrapperSize = size === 'small' ? 'w-12 h-12' : 'w-16 h-16';
  // default: parent wrapper = 64px, child icon = 32px
  // small: parent wrapper = 48px, child icon = 24px
  const iconSize = size === 'small' ? '[&>svg]:w-6 [&>svg]:h-6' : '[&>svg]:w-8 [&>svg]:h-8';

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-background-2 border border-border-1 ${wrapperSize} ${iconSize} ${className}`}
    >
      {children}
    </div>
  );
}
