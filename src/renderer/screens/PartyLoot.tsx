import { useEffect } from 'react';
import dummyPartyLoot from '../../__data__/dummyPartyLoot.txt';
import CalculateLoot from '../../tools/party-loot';

const PartyLoot = () => {
  useEffect(() => {
    CalculateLoot();
  }, []);
  return (
    <div>
      <h1>Party Loot Share</h1>
      <div className="mainContent">
        <div>
          <textarea
            id="party-loot-input"
            style={{
              color: 'black',
              width: '400px',
              height: '500px',
            }}
            value={dummyPartyLoot}
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
