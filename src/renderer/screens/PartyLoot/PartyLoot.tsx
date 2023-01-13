import { useCallback, useEffect, useState } from 'react';
import dummyPartyLoot from '../../../__data__/dummyPartyLoot.txt';
import CalculateLoot from '../../../tools/party-loot';
import './PartyLoot.css';

const PartyLoot = () => {
  const [text, setText] = useState(dummyPartyLoot);
  const [outputText, setOutputText] = useState('');

  const recalculate = useCallback(() => {
    const result = CalculateLoot(text);
    setOutputText(result);
  }, [text]);

  useEffect(() => {
    recalculate();
  }, [recalculate]);

  const updateInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    recalculate();
  };
  return (
    <div className="container">
      <h1 className="section-title">Party Loot Share</h1>
      <div className="mainContent">
        <p className="my-5">Calculate your cut in the hunt.</p>
        <div className="flex justify-even w-full">
          <textarea
            id="party-loot-input"
            className="party-loot-textarea"
            value={text}
            onChange={updateInput}
          />
          <div className="w-1/2">
            <div
              id="party-loot-output"
              className="party-loot-output mt-8"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: outputText }}
            />
            <div className="party-loot-buttons">
              <button
                type="button"
                className="party-loot-button hover:bg-indigo-600 hover:text-white"
                onClick={recalculate}
              >
                Calculate
              </button>
              <button
                type="button"
                className="party-loot-button hover:bg-indigo-600 hover:text-white"
              >
                Save party session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartyLoot;
