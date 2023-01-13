import { HuntSession } from 'contexts/HuntSessionsContext';
import { Session } from '../../types/types';
import './HuntSessionSummary.scss';
import CoinsImage from '../../../assets/crystalcoins.png';
import HealIcon from '../../../assets/heal.svg';
import AttackIcon from '../../../assets/attack.svg';
import TimeIcon from '../../../assets/time.svg';
import XPIcon from '../../../assets/xp.png';

const HuntSessionSummary = ({ hunt }: { hunt: HuntSession }) => {
  const session: Session = hunt.session as Session;
  return (
    <div className="w-full p-5 max-h-full overflow-y-scroll">
      <div className="card">
        <div className="card-title">Hunt Information</div>
        <div className="card-content flex-col">
          <div className="flex">
            <p className="session-length outlined-title">
              <img
                src={TimeIcon}
                alt="Session duration"
                width="56px"
                className="mr-5"
              />
              {session['Session length']}
            </p>
            <p
              className={`session-balance ${
                parseInt(session.Balance, 10) > 0
                  ? 'balance-profit'
                  : 'balance-waste'
              }`}
            >
              <img alt="balance" width="60px" src={CoinsImage} />
              {session.Balance}
            </p>
          </div>
          <div className="flex flex-col ">
            <div className="flex justify-center">
              <img alt="xp" width="150px" src={XPIcon} />
              <div className="flex flex-col items-end">
                <span className="mt-5 mb-2 text-6xl">{session['XP Gain']}</span>
                <span className="text-slate-500">
                  @ {session['XP/h']} exp/hour
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-title">Damage / Healing</div>
        <div className="card-content">
          <div className="flex flex-col w-1/2 justify-center items-center">
            <img className="w-20 icon" src={AttackIcon} alt="heal icon" />
            <span className="mt-5 mb-2 text-4xl">{session.Damage}</span>
            <span className="text-slate-500">
              @ {session['Damage/h']} damage/hour
            </span>
          </div>
          <div className="flex flex-col w-1/2 justify-center items-center">
            <img className="w-20 icon" src={HealIcon} alt="heal icon" />
            <span className="mt-5 mb-2 text-4xl">{session.Healing}</span>
            <span className="text-slate-500">
              @ {session['Healing/h']} healing/hour
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
        <div className="card-title justify-between">
          Loot Balance
          <div className="flex items-center">
            <img alt="balance" width="60px" src={CoinsImage} />
            <span className="outlined-title text-yellow-500 text-xl ml-5">
              {session.Loot}
            </span>
          </div>
        </div>
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
