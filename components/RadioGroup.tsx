
import React from 'react';
import type { RadioOption } from '../types';

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ name, options, selectedValue, onChange }) => {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
      {options.map(option => (
        <label key={option.value} className="inline-flex items-center cursor-pointer">
          <input
            type="radio"
            className="form-radio text-blue-600 h-4 w-4"
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={e => onChange(e.target.value)}
          />
          <span className="ml-2 text-gray-700">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;
