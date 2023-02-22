import { HuntSession, useHuntSessions } from 'contexts/HuntSessionsContext';
import { SyntheticEvent, useState } from 'react';
import Chart from 'components/Chart/Chart';
import { useTibiaWidgetsContext } from '../../../contexts/TibiaWidgetsContext';
import HuntSessionSummary from '../../../components/HuntSessionSummary/HuntSessionSummary';
import './HuntSessions.scss';

const HuntSessions = () => {
  const [selected, setSelected] = useState<HuntSession>({ name: '' });
  const { appConfig } = useTibiaWidgetsContext();
  const { hunts } = useHuntSessions();

  const getSelectedHunt = (name: string) => {
    return hunts.filter((hunt) => hunt.name === name)[0];
  };
  const handleSelected = (e: SyntheticEvent) => {
    const selectedName = e.currentTarget.textContent;
    const selectedHunt = getSelectedHunt(selectedName || '');
    setSelected(selectedHunt);
  };
  return (
    <div className="w-full">
      <h1 className="section-title">Hunt Sessions</h1>
      <p className="my-5">
        Revisit your hunting sessions, analyze and improve your hunt.
      </p>
      <div>
        <Chart />
      </div>
      {hunts ? (
        <div className="flex flex-col">
          <h2 className="text-lg font-bold">Yor hunting sessions</h2>
          <div className="flex">
            <div className="border-2 border-black rounded p-2 mr-1 max-w-sm min-w-60 flex-shrink-0 overflow-y-scroll h-full">
              {hunts.map((hunt: HuntSession) => (
                <button
                  type="button"
                  key={hunt.name}
                  className={`hunting-session-name flex flex-col ${
                    hunt.name === selected.name ? 'hunt-selected' : ''
                  }`}
                  onClick={handleSelected}
                >
                  {hunt.name}
                </button>
              ))}
            </div>
            <div className="border-2 border-black rounded p-2 w-1/2 flex flex-grow justify-center items-center visualizer overflow-y-scroll">
              {selected.session ? (
                <HuntSessionSummary hunt={selected} />
              ) : (
                <span className=" text-slate-400">Select a hunt</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <span>You haven&apos;t selected your Tibia installation path.</span>
      )}
    </div>
  );
};

export default HuntSessions;
