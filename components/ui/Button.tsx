import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "flex items-center justify-center px-4 py-3 rounded-2xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-500",
    danger: "bg-red-50 hover:bg-red-100 text-red-500"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
