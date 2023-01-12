import { useTibiaWidgetsContext } from 'contexts/TibiaWidgetsContext';
import { useEffect, useState } from 'react';

const Settings = () => {
  const [tibiaPath, setTibiaPath] = useState('');
  const [isPathInitialized, setIsPathInitialized] = useState(false);
  const { directoryHandler: globalDirectoryHandler, setDirectoryChange } =
    useTibiaWidgetsContext();
  const handlePathSelect = async () => {
    const directoryHandle = await window
      .showDirectoryPicker()
      .catch(console.error);
    if (directoryHandle) {
      setDirectoryChange(directoryHandle);
    }
  };
  useEffect(() => {
    if (globalDirectoryHandler) {
      setIsPathInitialized(true);
    }
  }, [globalDirectoryHandler]);
  return (
    <section>
      <h1 className="section-title">Settings</h1>
      <div className="section-card mt-10">
        <div className="card-title text-lg font-bold">
          Configure Tibia Installation Path
        </div>
        <div className="card-content flex items-center">
          <div className="mr-5">
            {isPathInitialized ? (
              <span>ok</span>
            ) : (
              <span>Not yet selected</span>
            )}
          </div>
          <button type="button" className="btn-blue" onClick={handlePathSelect}>
            {isPathInitialized ? 'Change' : 'Select'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Settings;
