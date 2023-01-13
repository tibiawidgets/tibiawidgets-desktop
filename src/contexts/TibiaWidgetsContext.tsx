import React, { createContext, useContext, useEffect, useState } from 'react';
import { JSONConfigFile } from 'types/types';

type TibiaWidgetsContextValue = {
  appConfig: JSONConfigFile;
  directoryHandler: FileSystemDirectoryHandle | null;
  setDirectoryChange: (handler: FileSystemDirectoryHandle) => void;
};

const initialTibiaWidgetsContextValue: TibiaWidgetsContextValue = {
  appConfig: {} as JSONConfigFile,
  directoryHandler: null,
  setDirectoryChange: () => {},
};

export const TibiaWidgetsContext = createContext<TibiaWidgetsContextValue>(
  initialTibiaWidgetsContextValue
);

const TibiaWidgetsContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [appConfig, setAppConfig] = useState(
    initialTibiaWidgetsContextValue.appConfig
  );
  const [directoryHandler, setDirectoryHandler] = useState(
    initialTibiaWidgetsContextValue.directoryHandler
  );

  const appInit = () => {
    window.electron.ipcRenderer.on('init', (config) => {
      setAppConfig(config as JSONConfigFile);
    });
    window.electron.ipcRenderer.sendMessage('init', []);
  };

  useEffect(() => {
    appInit();
  }, []);

  const setDirectoryChange = (
    newDirectoryHandler: FileSystemDirectoryHandle
  ) => {
    if (
      !directoryHandler ||
      newDirectoryHandler.name !== directoryHandler.name
    ) {
      setDirectoryHandler(newDirectoryHandler);
    }
  };
  const value = {
    appConfig,
    directoryHandler,
    setDirectoryChange,
  };
  return (
    <TibiaWidgetsContext.Provider value={value}>
      {children}
    </TibiaWidgetsContext.Provider>
  );
};

export { TibiaWidgetsContextProvider };

export const useTibiaWidgetsContext = () => useContext(TibiaWidgetsContext);
