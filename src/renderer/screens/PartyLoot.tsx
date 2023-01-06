import dummyPartyLoot from '../../__data__/dummyPartyLoot.txt';

const PartyLoot = () => {
  return (
    <div>
      <h1>Party Loot Share</h1>
      <div className="mainContent">
        <div>
          <textarea
            style={{
              color: 'black',
              width: '400px',
              height: '500px',
            }}
            value={dummyPartyLoot}
          />
        </div>
      </div>
    </div>
  );
};

export default PartyLoot;
