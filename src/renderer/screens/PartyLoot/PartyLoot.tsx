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
    <div>
      <h1 className="title">Party Loot Share</h1>
      <div className="mainContent">
        <span>Calculate your cut in the hunt.</span>
        <div>
          <textarea
            id="party-loot-input"
            className="party-loot-textarea"
            value={text}
            onChange={updateInput}
          />
        </div>
        <div>
          <div
            id="party-loot-output"
            className="party-loot-output"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: outputText }}
          />
        </div>
      </div>
    </div>
  );
};

export default PartyLoot;
