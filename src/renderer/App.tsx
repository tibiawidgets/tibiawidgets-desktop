import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import { HuntSessionsContextProvider } from 'contexts/HuntSessionsContext';
import { TibiaWidgetsContextProvider } from 'contexts/TibiaWidgetsContext';
import Home from './screens/Home';
import Drawer from '../components/Drawer/Drawer';
import Settings from './screens/Settings/Settings';
import HuntSessions from './screens/HuntSessions/HuntSessions';
import PartyLoot from './screens/PartyLoot/PartyLoot';

export default function App() {
  return (
    <TibiaWidgetsContextProvider>
      <HuntSessionsContextProvider>
        <div className=" h-full flex">
          <Router>
            <Drawer />
            <div className="flex px-5 py-10 bg-slate-100 flex-grow">
              <Routes>
                <Route path="/party-loot" element={<PartyLoot />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/hunt-sessions" element={<HuntSessions />} />
                <Route path="/" element={<Home />} />
              </Routes>
            </div>
          </Router>
        </div>
      </HuntSessionsContextProvider>
    </TibiaWidgetsContextProvider>
  );
}
