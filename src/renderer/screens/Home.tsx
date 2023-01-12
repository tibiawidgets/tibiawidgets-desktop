const Home = () => {
  return (
    <div className="container">
      <h1 className="text-lg text-4xl font-bold">Welcome to Tibia Widgets</h1>
      <div>
        <div className="pl-10">
          <p className="mt-10 text-lg">
            Tibia Widgets is a tool to help you analyze your hunts and give you
            insights of your overall sessions.
          </p>
          <p className="my-10 text-lg">
            Login into your account to have your Tibia configurations ready to
            import to the Tibia Client.
          </p>
          <p className="my-10 text-lg">
            Never lose again your client configuration.
          </p>
          <p className="my-10 text-lg">
            Analyze your previous hunts to maximize your profit
          </p>
        </div>

        <div className="flex justify-center justify-evenly">
          <div className="shadow-gray-400 shadow-md border-solid rounded-md min-w-1/4 max-w-sm mt-10 p-5">
            <span className="text-center font-bold">Free features:</span>
            <ul className="text-md list-disc p-5">
              <li className="list-item">
                Calculate your share in your current party session.&nbsp;
                <span className="font-bold">Don&apos;t fall behind!</span>
              </li>
              <li className="list-item">
                Check at your local client saved solo & party hunting sessions
              </li>
              <li className="list-item">
                Take a look at your local screenshots from all your Tibia
                Characters
              </li>
              <li className="list-item">
                Get to know today&apos;s current boosted creatures, bosses and
                Rashid&apos;s location&nbsp;
                <span className="font-bold">Just a click away!</span>
              </li>
            </ul>
          </div>
          <div className="shadow-gray-400 shadow-md border-solid rounded-md min-w-1/4 max-w-sm mt-10 p-5">
            <div className="">
              <span className="text-center font-bold">Premium features:</span>
              <ul className="text-md list-disc p-5">
                <li className="list-item">
                  Save your client config & minimap in the cloud
                </li>
                <li className="list-item">
                  Save your Solo & Party hunting sessions in the cloud
                </li>
                <li className="list-item">
                  Save your party hunt sessions from the Party Loot Share in the
                  cloud
                </li>
              </ul>
            </div>
            <span className="flex justify-evenly my-5">
              <span className="text-3xl self-center">Only</span>{' '}
              <span className="text-6xl">$2</span>
              <span className="text-2x1 self-end">/Month</span>
            </span>
            <div className="mt-10 text-md flex justify-center flex-col">
              <button
                type="button"
                className="border-yellow-500 bg-yellow-300 rounded-md p-5 font-bold text-indigo-600 hover:bg-yellow-500 hover:text-white"
              >
                JOIN NOW!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
