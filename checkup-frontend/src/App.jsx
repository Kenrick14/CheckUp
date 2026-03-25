import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchBox from './components/SearchBox';
import PlayerStatsTable from './components/PlayerStatsTable';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', backgroundColor: '#0f1117', color: '#e8e8e8' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<SearchBox />} />
          <Route path="/stats" element={<PlayerStatsTable />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;