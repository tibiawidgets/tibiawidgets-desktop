import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import PartyLoot from './screens/PartyLoot/PartyLoot';
import Home from './screens/Home';
import Drawer from '../components/Drawer/Drawer';

export default function App() {
  return (
    <div className="w-full h-full flex overflow-hidden">
      <Router>
        <Drawer />
        <div className="container flex px-5 py-10 flex-grow bg-slate-100 overflow-y-scroll">
          <Routes>
            <Route path="/party-loot" element={<PartyLoot />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}
