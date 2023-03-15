import { useState } from 'react';
import Login from './Login';
import SignIn from './SignIn';
import './Login.css';

type OptionType = 'login' | 'signin';

const MainLogin = () => {
  const [option, setOption] = useState<OptionType>('login');
  return (
    <div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="flex text-lg font-bold justify-evenly">
          <button
            type="button"
            className={`block mt-4 lg:inline-block lg:mt-0 hover:text-white mr-4 ${
              option === 'login' ? 'active-tab outlined-title' : 'outlined-text'
            }`}
            onClick={() => setOption('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={`block mt-4 lg:inline-block lg:mt-0 hover:text-white mr-4 ${
              option === 'signin'
                ? 'active-tab outlined-title'
                : 'outlined-text'
            }`}
            onClick={() => setOption('signin')}
          >
            Sign In
          </button>
        </div>
      </div>
      <div className="py-6">
        {option === 'login' && <Login />}
        {option === 'signin' && <SignIn />}
      </div>
    </div>
  );
};

export default MainLogin;
