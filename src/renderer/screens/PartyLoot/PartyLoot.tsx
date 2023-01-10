import { useEffect, useState } from 'react';
import dummyPartyLoot from '../../../__data__/dummyPartyLoot.txt';
import CalculateLoot from '../../../tools/party-loot';
import './PartyLoot.css';

const PartyLoot = () => {
  const [text, setText] = useState(dummyPartyLoot);
  useEffect(() => {
    CalculateLoot();
  }, []);
  return (
    <div>
      <h1>Party Loot Share</h1>
      <div className="mainContent">
        <span>Calculate your share in the hunt.</span>
        <div>
          <textarea
            id="party-loot-input"
            className="party-loot-textarea"
            defaultValue={text}
          />
        </div>
        <div>
          <span id="party-loot-output" />
        </div>
      </div>
    </div>
  );
};

export default PartyLoot;
