import { HuntSession, useHuntSessions } from 'contexts/HuntSessionsContext';
import { SyntheticEvent, useState } from 'react';
import Dialog from 'components/Dialog';
import SelectMenu from 'components/SelectMenu';
import Chart from 'components/Chart/Chart';
import { useTibiaWidgetsContext } from '../../../contexts/TibiaWidgetsContext';
import HuntSessionSummary from '../../../components/HuntSessionSummary/HuntSessionSummary';
import './HuntSessions.scss';

const HuntSessions = () => {
  const [showCharDialog, setShowCharDialog] = useState(false);
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

  const onSubmitChar = () => {};
  return (
    <div className="w-full">
      <h1 className="section-title mb-2">Hunt Sessions</h1>
      <button
        type="button"
        className="px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-700 text-white"
        onClick={() => setShowCharDialog(true)}
      >
        + Add character
      </button>
      <SelectMenu options={['Sir Paeris']} onSelect={(e) => console.log(e)} />
      <p className="my-5">
        Revisit your hunting sessions, analyze and improve your hunt.
      </p>
      <div>
        <Chart />
      </div>
      {hunts ? (
        <div className="flex flex-col">
          <h2 className="text-lg font-bold">Your hunting sessions</h2>
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
      <Dialog
        isOpen={showCharDialog}
        title="Add character"
        onClose={() => setShowCharDialog(false)}
        onSubmit={onSubmitChar}
      >
        <div className="mb-4">
          <label className="block font-bold mb-2" htmlFor="character">
            Character
            <input
              className="border rounded w-full py-2 px-3"
              id="character"
              name="character"
              type="text"
            />
          </label>
        </div>
      </Dialog>
    </div>
  );
};

export default HuntSessions;
