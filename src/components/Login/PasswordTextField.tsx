import { SyntheticEvent, useState } from 'react';
import { EyeSlashIcon, EyeIcon } from '@heroicons/react/24/solid';

type PasswordTextFieldType = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (target: SyntheticEvent<HTMLInputElement>) => void;
  required?: boolean;
};

const PasswordTextField = ({
  id,
  name,
  label,
  value,
  onChange,
  ...rest
}: PasswordTextFieldType) => {
  const [isHidden, setIsHidden] = useState(true);
  return (
    <label htmlFor={id} className="">
      <span className="font-bold text-gray-500">{label}</span>
      <div className="relative mt-1">
        <input
          {...rest}
          required
          name={name}
          type={isHidden ? 'password' : 'text'}
          id={id}
          className="rounded-r-md flex-1 appearance-none border border-gray-200 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base"
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          className="absolute top-0 right-0 mt-3 mr-4 h-4 w-4 hover:bg-gray-300 rounded-lg"
          onClick={() => setIsHidden((prev) => !prev)}
        >
          {isHidden ? <EyeSlashIcon /> : <EyeIcon />}
        </button>
      </div>
    </label>
  );
};

export default PasswordTextField;
