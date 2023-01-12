import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

type TibiaWidgetsContextValue = {
  path: string;
  directoryHandler: FileSystemDirectoryHandle | null;
  setDirectoryChange: (handler: FileSystemDirectoryHandle) => void;
};

const initialTibiaWidgetsContextValue: TibiaWidgetsContextValue = {
  path: '',
  directoryHandler: null,
  setDirectoryChange: () => {},
};

export const TibiaWidgetsContext = createContext<TibiaWidgetsContextValue>(
  initialTibiaWidgetsContextValue
);

const TibiaWidgetsContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [path, setPath] = useState(initialTibiaWidgetsContextValue.path);
  const [directoryHandler, setDirectoryHandler] = useState(
    initialTibiaWidgetsContextValue.directoryHandler
  );

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
    path,
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
