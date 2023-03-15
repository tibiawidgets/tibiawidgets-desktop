import { SyntheticEvent, useState } from 'react';
import PasswordTextField from './PasswordTextField';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onChange = (event: SyntheticEvent<HTMLInputElement>) => {
    if (event.currentTarget.name === 'username') {
      setUsername(event.currentTarget.value);
    } else if (event.currentTarget.name === 'password') {
      setPassword(event.currentTarget.value);
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
          id="password"
          name="password"
          label="Password"
          value={password}
          onChange={onChange}
          required
        />
      </div>
      <button
        className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-700 w-full mt-6"
        type="submit"
      >
        Login
      </button>
      <div className="relative">
        <hr className="my-8 border-gray-300" />
        <span className="absolute text-gray-500 left-1/2 -top-3 bg-white -ml-2">
          OR
        </span>
      </div>
      <button
        className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-700 w-full"
        type="submit"
      >
        Sign In with Google
      </button>
    </form>
  );
};

export default Login;
