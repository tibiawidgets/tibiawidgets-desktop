import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import PartyLoot from './screens/PartyLoot/PartyLoot';
import Home from './screens/Home';
import Drawer from '../components/Drawer';

export default function App() {
  return (
    <div className="w-full flex">
      <Router>
        <Drawer />
        <div className="px-5 py-10 flex-grow">
          <Routes>
            <Route path="/party-loot" element={<PartyLoot />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}
