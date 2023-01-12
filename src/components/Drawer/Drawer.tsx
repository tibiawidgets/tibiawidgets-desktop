import { CSSProperties } from 'react';
import { NavLink } from 'react-router-dom';
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
    label: 'Solo Hunting Sessions',
    route: '/solo-hunt',
  },
  {
    label: 'Party Hunting Sessions',
    route: '/party-hunt',
  },
];

const Drawer = () => (
  <nav className="flex h-full bg-cyan-100" aria-label="Sidebar">
    <div className="flex flex-col my-5 ">
      <div className="flex flex-col flex-grow">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            className="p-5 font-bold outlined-text"
            to={item.route}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
      <div className="flex justify-center my-5">
        <button className="btn-blue outlined-text" type="button">
          Log in
        </button>
      </div>
    </div>
  </nav>
);

export default Drawer;
