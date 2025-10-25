import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  text?: string;
  small?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, text, small = false }) => {
  const percentage = (value / max) * 100;

  let colorClass = 'bg-green-500';
  if (percentage < 70) colorClass = 'bg-yellow-400';
  if (percentage < 40) colorClass = 'bg-red-500';

  return (
    <div className={`w-full bg-green-900/50 ${small ? 'h-2.5' : 'h-4'} relative overflow-hidden`}>
      <div
        className={`h-full ${colorClass} transition-all duration-300`}
        style={{ width: `${percentage}%` }}
      ></div>
      {text && (
        <span className={`absolute inset-0 flex items-center justify-center ${small ? 'text-xs' : 'text-sm'} font-bold text-white text-shadow`}>
          {text}
        </span>
      )}
    </div>
  );
};

// Add a simple text shadow utility to Tailwind via a style tag (as we can't edit tailwind.config.js)
const style = document.createElement('style');
style.innerHTML = `
  .text-shadow {
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  }
`;
document.head.appendChild(style);


export default ProgressBar;