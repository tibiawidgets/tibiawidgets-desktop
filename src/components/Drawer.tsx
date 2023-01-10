import { NavLink } from 'react-router-dom';

const Drawer = () => (
  <aside className="" aria-label="Sidebar">
    <div className="h-full shadow-md px-1" style={{ background: 'lightgray' }}>
      <ul className="relative">
        <li className="relative">
          <NavLink
            className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
            to="/"
            data-mdb-ripple="true"
            data-mdb-ripple-color="dark"
          >
            Home
          </NavLink>
        </li>
        <li className="relative">
          <NavLink
            className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
            to="/party-loot"
            data-mdb-ripple="true"
            data-mdb-ripple-color="dark"
          >
            Party Loot Share
          </NavLink>
        </li>
        <li className="relative">
          <a
            className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
            href="#!"
            data-mdb-ripple="true"
            data-mdb-ripple-color="dark"
          >
            Sidenav link 2
          </a>
        </li>
      </ul>
    </div>
  </aside>
);

export default Drawer;
