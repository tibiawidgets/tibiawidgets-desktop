import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { Session } from 'types/types';
import { useTibiaWidgetsContext } from './TibiaWidgetsContext';

export type HuntSession = {
  name: string;
  session?: Session;
};

export type HuntSessionsContextValue = {
  hunts: HuntSession[];
  synchHuntSessions: () => void;
};

const initialHuntsContextValue: HuntSessionsContextValue = {
  hunts: [],
  synchHuntSessions: () => {},
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
      window.electron.ipcRenderer.sendMessage('getHuntSessions', []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appConfig]);

  const synchHuntSessions = async () => {
    if (appConfig.tibiaClientPath) {
      window.electron.ipcRenderer.once('synchHuntSessions', () => {
        console.log('synch finilized');
        getHuntingSessions();
      });
      window.electron.ipcRenderer.sendMessage('synchHuntSessions', []);
    }
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('getHuntSessions', (huntSessions) => {
      const myhunts = huntSessions as HuntSession[];
      console.log(myhunts.length);
      setHunts(myhunts);
    });

    getHuntingSessions();
  }, [getHuntingSessions]);

  return (
    <HuntSessionsContext.Provider value={{ hunts, synchHuntSessions }}>
      {children}
    </HuntSessionsContext.Provider>
  );
};

export { HuntSessionsContextProvider };

export const useHuntSessions = () => {
  return useContext(HuntSessionsContext);
};
