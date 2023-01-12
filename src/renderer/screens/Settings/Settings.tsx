import { useState } from 'react';

const Settings = () => {
  const [tibiaPath, setTibiaPath] = useState('');
  const handlePathSelect = async () => {
    const directoryHandle = await window.showDirectoryPicker();
    // eslint-disable-next-line no-restricted-syntax
    for await (const entry of directoryHandle.values()) {
      const fileHandle = await directoryHandle.getFileHandle(entry.name);
      const huntFile = await fileHandle.getFile();
      if (entry.name.match('.json')) {
        console.log(entry.kind, entry.name);
        const reader = new FileReader();
        reader.onload = (event) => {
          console.log(event.target.result);
        };
        reader.readAsText(huntFile);
      }
    }
  };
  return (
    <section>
      <h1 className="section-title">Settings</h1>
      <div className="section-card mt-10">
        <div className="card-title text-lg font-bold">
          Configure Tibia Installation Path
        </div>
        <div className="card-content flex justify-between items-center">
          <input
            type="text"
            className="border-x-2 border-y-2 w-5/6 h-10 text-lg px-2"
            placeholder="path://example/Tibia"
            value={tibiaPath}
            onChange={(e) => setTibiaPath(e.currentTarget.value)}
          />
          <button
            type="button"
            className=" btn-blue"
            onClick={handlePathSelect}
          >
            Save
          </button>
        </div>
      </div>
    </section>
  );
};

export default Settings;
