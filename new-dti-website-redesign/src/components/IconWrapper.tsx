type IconWrapperProps = {
  children: React.ReactNode;
  size?: 'large' | 'default' | 'small';
  type?: 'primary' | 'default';
  className?: string;
};

export default function IconWrapper({
  children,
  size = 'default',
  type = 'default',
  className = ''
}: IconWrapperProps) {
  let wrapperSize = '';
  let iconSize = '';

  switch (size) {
    case 'large':
      wrapperSize = 'w-16 h-16'; // 64px
      iconSize = '[&>svg]:w-8 [&>svg]:h-8'; // 32px
      break;
    case 'default':
      wrapperSize = 'w-12 h-12'; // 48px
      iconSize = '[&>svg]:w-6 [&>svg]:h-6'; // 24px
      break;
    case 'small':
    default:
      wrapperSize = 'w-8 h-8'; // 32px
      iconSize = '[&>svg]:w-4 [&>svg]:h-4'; // 16px
      break;
  }

  const wrapperColor =
    type === 'primary'
      ? 'bg-foreground-1 text-background-1'
      : 'bg-background-2 border border-border-1';

  return (
    <div
      className={`flex items-center justify-center rounded-full ${wrapperSize} ${wrapperColor} ${iconSize} ${className}`}
      aria-hidden={true}
    >
      {children}
    </div>
  );
}
