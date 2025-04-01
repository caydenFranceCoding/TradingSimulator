import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
    return (
        <Router>
      <div className="app-container">
        <header>
          <h1>Trading Simulator</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<div>Dashboard Coming Soon</div>} />
            <Route path="/trading" element={<div>Trading Coming Soon</div>} />
            <Route path="/market" element={<div>Market View Coming Soon</div>} />
          </Routes>
        </main>
      </div>
    </Router>
    );
}

export default App;