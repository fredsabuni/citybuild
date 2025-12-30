'use client';

import Image from 'next/image';

interface CityBuildLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const CityBuildLogo: React.FC<CityBuildLogoProps> = ({ 
  size = 'md', 
  showText = true,
  className = '' 
}) => {
  const sizeMap = {
    sm: { width: 32, height: 32 },
    md: { width: 120, height: 40 },
    lg: { width: 150, height: 50 },
    xl: { width: 200, height: 66 },
  };

  const { width, height } = sizeMap[size];

  return (
    <div className={`flex items-center ${className}`}>
      <Image 
        src="/image/citybuild-logo.png"
        alt="CityBuild Logo"
        width={width}
        height={height}
        priority
        className="object-contain"
      />
    </div>
  );
};