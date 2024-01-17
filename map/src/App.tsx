import React from 'react';
import './App.css';
import MapComponent from "./MapComponent/MapComponent";

const App: React.FC = () => {
  return (
      <div className="backSide">
        <h1 className="title">Quest Map</h1>
        <MapComponent />
      </div>
  );
};

export default App;
