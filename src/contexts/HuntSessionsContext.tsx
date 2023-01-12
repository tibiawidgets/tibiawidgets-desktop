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
  const { directoryHandler } = useTibiaWidgetsContext();

  const addHunt = (newHunt: HuntSession) => {
    const huntsCopy: Array<HuntSession> = hunts;
    huntsCopy.push(newHunt);
    setHunts(huntsCopy);
  };
  const getHuntingSessions = useCallback(async () => {
    if (directoryHandler) {
      // eslint-disable-next-line no-restricted-syntax
      for await (const entry of directoryHandler.values()) {
        const fileHandle = await directoryHandler.getFileHandle(entry.name);
        const huntFile = await fileHandle.getFile();
        if (entry.name.match('.json')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const hunt: HuntSession = {
              name: entry.name,
            };
            try {
              hunt.session = JSON.parse(event?.target?.result);
              addHunt(hunt);
            } catch (e) {
              console.error('Failed to parse hunt session ', hunt.name);
            }
          };
          reader.readAsText(huntFile);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [directoryHandler]);

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
