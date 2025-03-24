import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'gray';
  size?: 'sm' | 'md';
  rounded?: 'full' | 'md';
}

const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'sm',
  rounded = 'md',
}: BadgeProps) => {
  
  const variantClasses = {
    primary: 'bg-primary bg-opacity-10 text-primary',
    secondary: 'bg-secondary bg-opacity-10 text-secondary',
    success: 'bg-success bg-opacity-10 text-success',
    warning: 'bg-warning bg-opacity-10 text-warning',
    danger: 'bg-danger bg-opacity-10 text-danger',
    info: 'bg-blue-500 bg-opacity-10 text-blue-500',
    gray: 'bg-gray-500 bg-opacity-10 text-gray-500',
  };
  
  const sizeClasses = {
    sm: 'text-xs py-0.5 px-2',
    md: 'text-sm py-1 px-3',
  };
  
  const roundedClasses = {
    full: 'rounded-full',
    md: 'rounded-md',
  };
  
  return (
    <span className={`inline-flex font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${roundedClasses[rounded]}`}>
      {children}
    </span>
  );
};

export default Badge; 