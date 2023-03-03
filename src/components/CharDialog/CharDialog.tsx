import { SyntheticEvent, useEffect, useState } from 'react';
import { v4 } from 'uuid';
import Dialog from '../Dialog';
import { ProgressBar } from '../ProgressBar';

export type CharDialogType = {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
};

export type StageType = {
  show: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  onClose?: () => void;
  next?: () => void;
  previous?: () => void;
  charName?: string;
};

export type StageAddChatType = StageType & {
  handleNameUpdate: (e: SyntheticEvent) => void;
};

const STAGE_ADD_NAME = 0;
const STAGE_VERIFY = 1;

const StageAddChar: React.FC<StageAddChatType> = ({
  show,
  previous,
  next,
  charName,
  handleNameUpdate,
}: StageAddChatType) => {
  if (!show) return null;

  const handleNameSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (next) {
      next();
    }
  };

  return (
    <form onSubmit={handleNameSubmit}>
      <label className="block font-bold mb-2" htmlFor="character">
        Character
        <input
          className="border rounded w-full py-2 px-3"
          id="character"
          name="character"
          value={charName}
          onChange={handleNameUpdate}
          type="text"
          required
        />
      </label>
      <button
        type="button"
        className="bg-red-500 text-white rounded py-2 px-4 hover:bg-red-700 mr-5"
        onClick={previous}
      >
        Close
      </button>
      <button
        type="submit"
        className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-700"
      >
        Next
      </button>
    </form>
  );
};

const StageVerify: React.FC<StageType> = ({
  show,
  charName,
  previous,
  onClose,
  next,
}: StageType) => {
  const [code, setCode] = useState('');

  useEffect(() => {
    // generate code
    const v4code = v4();
    setCode(v4code);
  }, [setCode]);

  const copyCode = (e: SyntheticEvent<HTMLButtonElement>): void => {
    console.log(e);
    navigator.clipboard.writeText(code);
  };

  if (!show) return null;

  const verify = () => {
    // make request for char
    if (next) {
      next();
    }
    console.log('verifying', charName);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div>
      <div className="my-3">
        <span>The following code has been generated.</span>
        <b>{code}</b>
        <button
          type="button"
          onClick={copyCode}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 mb-5"
        >
          Copy
        </button>
        <ul title="Follow theres steps" className="list-decimal">
          <li>
            <span>Login into your account at www.tibia.com</span>
          </li>
          <li>
            <span>
              On your character list, select <b>{charName}</b> and click on
              edit.
            </span>
          </li>
          <li>
            <span>
              Paste it at the bottom of your character comment section and save
              it.
            </span>
          </li>
          <li>
            <span>
              Come back to this dialog and click on <b>Confirm</b>
            </span>
          </li>
        </ul>
      </div>
      <button
        type="button"
        className="bg-red-500 text-white rounded py-2 px-4 hover:bg-red-700 mr-5"
        onClick={previous}
      >
        Back
      </button>
      <button
        type="submit"
        className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-700"
        onClick={verify}
      >
        Confirm
      </button>
    </div>
  );
};

export const CharDialog: React.FC<CharDialogType> = ({
  isOpen,
  onSuccess,
  onClose,
}: CharDialogType) => {
  const [stage, setStage] = useState(STAGE_ADD_NAME);
  const [charName, setCharName] = useState('');

  useEffect(() => {
    return () => {
      setStage(STAGE_ADD_NAME);
    };
  }, []);

  const handleNameUpdate = (e: SyntheticEvent) => {
    const { value } = e.target;
    setCharName(value);
  };

  const nextStage = () => {
    setStage(stage + 1);
  };

  const previousStage = () => {
    const newStage = stage - 1;
    if (newStage < 0) {
      onClose();
    } else {
      setStage(stage - 1);
    }
  };

  return (
    <Dialog isOpen={isOpen} title="Add character">
      <div className="mb-4">
        <ProgressBar stage={stage} labels={['Add Name', 'Verify']} />
        <StageAddChar
          show={stage === STAGE_ADD_NAME}
          previous={previousStage}
          handleNameUpdate={handleNameUpdate}
          next={() => {
            nextStage();
          }}
        />
        <StageVerify
          show={stage === STAGE_VERIFY}
          previous={previousStage}
          next={nextStage}
          charName={charName}
        />
      </div>
    </Dialog>
  );
};

export default CharDialog;
