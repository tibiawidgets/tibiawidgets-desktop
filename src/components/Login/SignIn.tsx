import { SyntheticEvent, useState } from 'react';
import PasswordTextField from './PasswordTextField';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');

  const onChange = (event: SyntheticEvent<HTMLInputElement>) => {
    if (event.currentTarget.name === 'username') {
      setUsername(event.currentTarget.value);
    } else if (event.currentTarget.name === 'password') {
      setPassword(event.currentTarget.value);
    } else if (event.currentTarget.name === 'verify-password') {
      setVerifyPassword(event.currentTarget.value);
    }
  };

  return (
    <form>
      <div>
        <label className="" htmlFor="username">
          <span className="font-bold text-gray-500">Username</span>
          <input
            required
            name="username"
            id="username"
            value={username}
            className="rounded-r-md flex-1 appearance-none border border-gray-200 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base mt-1"
            type="email"
            placeholder="email@tibia.com"
            onChange={onChange}
          />
        </label>
      </div>
      <div className="mt-4">
        <PasswordTextField
          required
          id="password"
          name="password"
          label="Password"
          value={password}
          onChange={onChange}
        />
      </div>
      <div className="mt-4">
        <PasswordTextField
          required
          id="verify-password"
          name="verify-password"
          label="Verify Password"
          value={verifyPassword}
          onChange={onChange}
        />
      </div>
      <button
        className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-700 w-full mt-6"
        type="submit"
      >
        Create account
      </button>
    </form>
  );
};

export default SignIn;
