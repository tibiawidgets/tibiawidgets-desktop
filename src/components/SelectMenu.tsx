import { useState } from 'react';

export type SelectOptionType = {
  key: string;
  value: string;
};

export type SelectProps = {
  options: SelectOptionType[];
  onSelect: (selectedOption: string) => void;
};

const Select: React.FC<SelectProps> = ({ options, onSelect }: SelectProps) => {
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleOptionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setSelectedOption(value);
    onSelect(value);
  };

  return (
    <div className="relative">
      <select
        value={selectedOption}
        onChange={handleOptionSelect}
        className="
          block
          appearance-none
          w-full
          py-2
          px-3
          pr-8
          rounded-md
          border
          border-gray-300
          bg-white
          text-gray-700
          hover:border-gray-400
          focus:outline-none
          focus:border-indigo-500
        "
      >
        <option value="" disabled hidden>
          Select an option
        </option>
        {options.map((option: SelectOptionType) => (
          <option key={option.key} value={option.value}>
            {option.value}
          </option>
        ))}
      </select>
      <div
        className="
          pointer-events-none
          absolute
          inset-y-0
          right-0
          flex
          items-center
          px-2
          text-gray-700
        "
      >
        <svg
          className="h-4 w-4 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M14.707 7.293a1 1 0 00-1.414 0L10 10.586l-3.293-3.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l4-4a1 1 0 000-1.414z" />
        </svg>
      </div>
    </div>
  );
};

export default Select;
