import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center font-bold transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed border-2';

  const variantClasses = {
    primary: 'border-green-500 text-green-400 hover:bg-green-500 hover:text-black',
    success: 'border-green-500 text-green-400 hover:bg-green-500 hover:text-black',
    danger: 'border-red-500 text-red-400 hover:bg-red-500 hover:text-black',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;