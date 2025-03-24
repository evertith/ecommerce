import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  label, 
  error, 
  helperText, 
  leftIcon, 
  rightIcon, 
  fullWidth = true,
  className = '',
  ...props 
}, ref) => {
  
  const inputBaseClasses = 'form-input rounded-md shadow-sm border-gray-300 focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-20';
  const hasError = !!error;
  const hasLeftIcon = !!leftIcon;
  const hasRightIcon = !!rightIcon;
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {hasLeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          {...props}
          ref={ref}
          className={`
            ${inputBaseClasses}
            ${hasError ? 'border-danger focus:border-danger focus:ring-danger' : ''}
            ${hasLeftIcon ? 'pl-10' : ''}
            ${hasRightIcon ? 'pr-10' : ''}
            ${fullWidth ? 'w-full' : ''}
          `}
        />
        
        {hasRightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      
      {(helperText || error) && (
        <p className={`mt-1 text-sm ${hasError ? 'text-danger' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 