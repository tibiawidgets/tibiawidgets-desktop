import { useTibiaWidgetsContext } from 'contexts/TibiaWidgetsContext';
import { useEffect, useState } from 'react';

const Settings = () => {
  const [isPathInitialized, setIsPathInitialized] = useState(false);
  const { setDirectoryChange, appConfig } = useTibiaWidgetsContext();
  // TODO: improve handler for selecting from app ui
  const handlePathSelect = async () => {
    const directoryHandle = await window
      .showDirectoryPicker()
      .catch(console.error);
    if (directoryHandle) {
      setDirectoryChange(directoryHandle);
    }
  };
  useEffect(() => {
    if (appConfig) {
      setIsPathInitialized(true);
    }
  }, [appConfig]);
  return (
    <section className="w-full p-5 max-h-full overflow-y-scroll">
      <h1 className="section-title">Settings</h1>
      <div className="card">
        <div className="card-title mt-10 text-lg font-bold">
          Configure Tibia Widgets Path
        </div>
        <div className="card-content flex items-center">
          <div>
            <p>We&apos;ll keep a copy of your hunting session files</p>
            <div className="flex items-center">
              <div className="mr-5">
                {appConfig.config_path ? (
                  <span className=" border-2 p-2 bg-slate-300">
                    {appConfig.config_path}
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
                {appConfig.config_path ? 'Change' : 'Select'}
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
                {appConfig.tibia_client_path ? (
                  <span className=" border-2 p-2 bg-slate-300">
                    {appConfig.tibia_client_path}
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
                {appConfig.tibia_client_path ? 'Change' : 'Select'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Settings;
