import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchBox from './components/SearchBox';
import PlayerStatsTable from './components/PlayerStatsTable';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<SearchBox />} />
        <Route path="/stats" element={<PlayerStatsTable />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;