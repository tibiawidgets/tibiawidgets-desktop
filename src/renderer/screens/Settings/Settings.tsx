import { useTibiaWidgetsContext } from 'contexts/TibiaWidgetsContext';

const Settings = () => {
  const { appConfig } = useTibiaWidgetsContext();
  // TODO: improve handler for selecting from app ui
  const handlePathSelect = async () => {};
  const handleClientPathSelect = async () => {
    window.electron.ipcRenderer.sendMessage('getHuntSessions', []);
  };
  return (
    <section className="w-full p-5 max-h-full overflow-y-scroll">
      <h1 className="section-title">Settings</h1>
      <div className="card hidden">
        <div className="card-title mt-10 text-lg font-bold">
          My hunts information
        </div>
        <div className="card-content flex items-center">
          <div>
            <p>We&apos;ll keep a copy of your hunting session files locally</p>
            <form className="flex justify-between w-full">
              <div className="mr-5">
                <label
                  className="text-gray-700 text-sm font-bold mb-2"
                  htmlFor="username"
                >
                  Character Name
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="username"
                    type="text"
                    placeholder="Username"
                  />
                </label>
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-title mt-10 text-lg font-bold">
          Configure Tibia Widgets Path
        </div>
        <div className="card-content flex items-center">
          <div>
            <p>We&apos;ll keep a copy of your hunting session files</p>
            <div className="flex items-center">
              <div className="mr-5">
                {appConfig.configPath ? (
                  <span className=" border-2 p-2 bg-slate-300">
                    {appConfig.configPath}
                  </span>
                ) : (
                  <span>Not yet selected</span>
                )}
              </div>
              <button
                type="button"
                className="btn-blue"
                onClick={handlePathSelect}
              >
                {appConfig.configPath ? 'Change' : 'Select'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-title mt-10 text-lg font-bold">
          Configure Tibia Client Path
        </div>
        <div className="card-content flex items-center">
          <div>
            <p>We&apos;ll keep a copy of your hunting session files</p>
            <div className="flex items-center">
              <div className="mr-5">
                {appConfig.tibiaClientPath ? (
                  <span className=" border-2 p-2 bg-slate-300">
                    {appConfig.tibiaClientPath}
                  </span>
                ) : (
                  <span>Not yet selected</span>
                )}
              </div>
              <button
                type="button"
                className="btn-blue"
                onClick={handleClientPathSelect}
              >
                {appConfig.tibiaClientPath ? 'Change' : 'Select'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Settings;
