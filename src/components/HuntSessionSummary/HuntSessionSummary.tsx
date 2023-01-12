import { HuntSession } from 'contexts/HuntSessionsContext';
import { Session } from '../../types/types';
import './HuntSessionSummary.scss';
import CoinsImage from '../../../assets/crystalcoins.png';
import HealIcon from '../../../assets/heal.svg';
import AttackIcon from '../../../assets/attack.svg';

const HuntSessionSummary = ({ hunt }: { hunt: HuntSession }) => {
  const session: Session = hunt.session as Session;
  console.log(session);
  return (
    <div className="w-full p-5 max-h-full overflow-y-scroll">
      <div className="card">
        <div className="card-title">Hunt Information</div>
        <div className="card-content">
          <p className="session-length outlined-title">
            {session['Session length']}
          </p>
          <p
            className={`session-balance ${
              session.Balance ? 'balance-profit' : 'balance-waste'
            }`}
          >
            <img
              alt="latest?cb=20050530025933&path-prefix=en&format=original"
              width="60px"
              src={CoinsImage}
            />
            {session.Balance}
          </p>
        </div>
      </div>
      <div className="card">
        <div className="card-title">Damage / Healing</div>
        <div className="card-content">
          <div className="flex flex-col w-1/2 justify-center items-center">
            <img className="w-20 icon" src={AttackIcon} alt="heal icon" />
            <span className="mt-5 mb-2 text-4xl">{session.Damage}</span>
            <span className="text-slate-500">
              @ {session['Damage/h']} exp/hour
            </span>
          </div>
          <div className="flex flex-col w-1/2 justify-center items-center">
            <img className="w-20 icon" src={HealIcon} alt="heal icon" />
            <span className="mt-5 mb-2 text-4xl">{session.Healing}</span>
            <span className="text-slate-500">
              @ {session['Healing/h']} exp/hour
            </span>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-title">Killed Monsters</div>
        <div className="card-content">
          <div className="monsters-container grid grid-cols-2 gap-2 w-full grid-flow-dense">
            {session['Killed Monsters'].map((monster) => (
              <div key={monster.Name}>
                <span className="font-bold">{monster.Count}x</span>{' '}
                {monster.Name}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-title">Loot</div>
        <div className="card-content">
          <div className="monsters-container grid grid-cols-2 gap-2 w-full grid-flow-dense">
            {session['Looted Items'].map((lootItem) => (
              <div key={lootItem.Name}>
                <span className="font-bold">{lootItem.Count}x</span>{' '}
                {lootItem.Name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HuntSessionSummary;
