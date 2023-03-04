import { HuntSession, useHuntSessions } from 'contexts/HuntSessionsContext';
import { SyntheticEvent, useState } from 'react';
import Chart from 'components/Chart/Chart';
import { CharDialog } from 'components/CharDialog';
import HuntSessionSummary from 'components/HuntSessionSummary/HuntSessionSummary';
import './HuntSessions.scss';
import { useTibiaWidgetsContext } from 'contexts/TibiaWidgetsContext';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const HuntSessions = () => {
  const [showCharDialog, setShowCharDialog] = useState(false);
  const [selected, setSelected] = useState<HuntSession>({ name: '' });
  const { appConfig } = useTibiaWidgetsContext();
  const { hunts, synchHuntSessions, filteredHunts } = useHuntSessions();

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
      <h1 className="section-title mb-2">Hunt Sessions</h1>
      {/* {' '}
      <button
        type="button"
        className="px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-700 text-white"
        onClick={() => setShowCharDialog(true)}
      >
        + Add character
      </button>
      <SelectMenu
        options={[
          { key: '1', value: 'All' },
          { key: '2', value: 'Unnassigned' },
          { key: '3', value: 'Sir Paeris' },
        ]}
        onSelect={(e) => console.log(e)}
      />
      */}
      <p className="flex my-5 justify-between items-center">
        <span>
          Revisit your hunting sessions, analyze and improve your hunt.
        </span>
        <button
          type="button"
          className=" flex px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-700 text-white"
          onClick={synchHuntSessions}
        >
          <ArrowPathIcon className="w-5 h-5 mr-2" />
          <span>Synch</span>
        </button>
      </p>
      <div>
        <Chart />
      </div>
      {hunts ? (
        <div className="flex flex-col">
          <h2 className="text-lg font-bold">
            Your hunting sessions ({hunts.length})
          </h2>
          <div className="flex pb-8 h-96">
            <div className="border-2 border-black rounded p-2 mr-1 max-w-sm min-w-60 flex-shrink-0 overflow-y-scroll h-full mb-8">
              {filteredHunts.map((hunt: HuntSession) => (
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
      <CharDialog
        isOpen={showCharDialog}
        onClose={() => setShowCharDialog(false)}
        onSuccess={() => setShowCharDialog(false)}
      />
    </div>
  );
};

export default HuntSessions;
