'use client';

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
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`relative ${sizeClasses[size]} bg-gradient-to-br from-primary to-brand-800 rounded-xl flex items-center justify-center shadow-lg`}>
        <div className="absolute inset-0 bg-primary/20 rounded-xl blur-sm"></div>
        <span className={`relative text-primary-foreground font-bold ${size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : size === 'lg' ? 'text-xl' : 'text-2xl'} tracking-tight`}>
          C
        </span>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex items-center">
          <span className={`font-bold text-primary ${textSizeClasses[size]} tracking-tight`}>
            CITY
          </span>
          <div className="w-1 h-6 bg-accent mx-1 rounded-full"></div>
          <span className={`font-bold text-foreground ${textSizeClasses[size]} tracking-tight`}>
            BUILD
          </span>
        </div>
      )}
    </div>
  );
};