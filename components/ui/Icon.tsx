import React, { memo } from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  size?: number | string;
  className?: string;
}

export const Icon: React.FC<IconProps> = memo(({ name, size = 24, className, ...props }) => {
  // @ts-ignore
  const LucideIcon = LucideIcons[name];

  if (!LucideIcon) {
    console.warn(`Icon ${name} not found`);
    return null;
  }

  return <LucideIcon size={size} className={className} {...props} />;
});
