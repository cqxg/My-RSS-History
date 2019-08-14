import React from 'react';
import './App.css';

import Dashboard from './Dashboard';
import Store from './Store';
import Web from './Store';

function App() {
  return (
    <div className="App">
      <Store>
        <Dashboard />
        <Web />
      </Store>
    </div>
  );
}

export default App;
