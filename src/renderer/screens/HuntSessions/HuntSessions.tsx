import { HuntSession, useHuntSessions } from 'contexts/HuntSessionsContext';
import { useTibiaWidgetsContext } from '../../../contexts/TibiaWidgetsContext';
import './HuntSessions.css';

const HuntSessions = () => {
  const { directoryHandler } = useTibiaWidgetsContext();
  const { hunts } = useHuntSessions();
  return (
    <section>
      <h1 className="section-title">Hunt Sessions</h1>
      <p className="my-5">
        Revisit your hunting sessions, analyze and improve your hunt.
      </p>
      {directoryHandler ? (
        <div>
          <h2 className="text-lg font-bold">Yor hunting sessions</h2>
          <div className="flex h-60">
            <div className="border-2 border-black rounded p-2 mr-1 max-w-sm min-w-60 flex-shrink-0">
              {hunts.map((hunt: HuntSession) => (
                <div key={hunt.name}>{hunt.name}</div>
              ))}
            </div>
            <div className="border-2 border-black rounded p-2 w-1/2 min-h-full flex justify-center items-center flex-grow visualizer">
              <span>visualizer</span>
            </div>
          </div>
        </div>
      ) : (
        <span>You haven&apos;t selected your Tibia installation path.</span>
      )}
    </section>
  );
};

export default HuntSessions;
