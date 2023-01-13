import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useTibiaWidgetsContext } from './TibiaWidgetsContext';

export type HuntSession = {
  name: string;
  session?: object;
};

export type HuntSessionsContextValue = {
  hunts: HuntSession[];
};

const initialHuntsContextValue: HuntSessionsContextValue = {
  hunts: [],
};

const HuntSessionsContext = createContext<HuntSessionsContextValue>(
  initialHuntsContextValue
);

const HuntSessionsContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hunts, setHunts] = useState<Array<HuntSession>>([]);
  const { appConfig } = useTibiaWidgetsContext();

  const getHuntingSessions = useCallback(async () => {
    if (appConfig.tibiaClientPath) {
      window.electron.ipcRenderer.on('getHuntSessions', (huntSessions) => {
        const myhunts = huntSessions as HuntSession[];
        setHunts(myhunts);
      });
      window.electron.ipcRenderer.sendMessage('getHuntSessions', []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appConfig]);

  useEffect(() => {
    getHuntingSessions();
  }, [getHuntingSessions]);

  return (
    <HuntSessionsContext.Provider value={{ hunts }}>
      {children}
    </HuntSessionsContext.Provider>
  );
};

export { HuntSessionsContextProvider };

export const useHuntSessions = () => {
  return useContext(HuntSessionsContext);
};
