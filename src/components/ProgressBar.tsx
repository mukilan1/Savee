import React from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  color?: 'emerald' | 'blue' | 'purple' | 'orange';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  className = '', 
  showPercentage = true,
  color = 'emerald'
}) => {
  const colorClasses = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 ${colorClasses[color]} transition-all duration-700 ease-out rounded-full`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      {showPercentage && (
        <span className="text-sm text-gray-600 mt-1 block">
          {Math.round(progress)}% complete
        </span>
      )}
    </div>
  );
};

export default ProgressBar;