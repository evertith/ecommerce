import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  options,
  error,
  helperText,
  fullWidth = true,
  className = '',
  ...props
}, ref) => {
  
  const selectBaseClasses = 'form-select rounded-md shadow-sm border-gray-300 focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-20';
  const hasError = !!error;
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <select
        {...props}
        ref={ref}
        className={`
          ${selectBaseClasses}
          ${hasError ? 'border-danger focus:border-danger focus:ring-danger' : ''}
          ${fullWidth ? 'w-full' : ''}
        `}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {(helperText || error) && (
        <p className={`mt-1 text-sm ${hasError ? 'text-danger' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select; 