import { NavLink } from 'react-router-dom';
import DonationButton from '../DonationButton';
import './Drawer.css';

const menuItems = [
  {
    label: 'Home',
    route: '/',
  },
  {
    label: 'Party Loot Share',
    route: '/party-loot',
  },
  {
    label: 'Hunting Sessions',
    route: '/hunt-sessions',
  },
  {
    label: 'Cloud Data',
    premium: true,
    route: '/cloud',
  },
  {
    label: 'Settings',
    route: '/settings',
  },
];

const PremiumLabel = ({ isPremium }: { isPremium: boolean }) => {
  if (!isPremium) return null;
  return <span className="premium-label outlined-text">Premium</span>;
};

const Drawer = () => (
  <nav className="flex h-full drawer-navbar" aria-label="Sidebar">
    <div className="flex flex-col my-5 ">
      <div className="flex flex-col flex-grow">
        {menuItems.map((item) => {
          return (
            <NavLink
              key={item.label}
              className="p-5 font-bold outlined-text whitespace-nowrap"
              to={item?.route || ''}
            >
              {item.label}
              <PremiumLabel isPremium={item.premium || false} />
            </NavLink>
          );
        })}
      </div>
      <div className="flex justify-center my-5 flex-col items-center">
        <DonationButton />
        <button className="btn-blue outlined-text" type="button">
          Log in
        </button>
      </div>
    </div>
  </nav>
);

export default Drawer;
