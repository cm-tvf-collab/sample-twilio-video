import React from 'react';
import './App.css';
import VideoChat from './VideoChat';

const App = () => {
  return (
    <div className="app">
        <h1 style={{textAlign: "center", marginBottom: "2rem"}}>Sample Video Room</h1>
      <main>
        <VideoChat />
      </main>

    </div>
  );
};

export default App;
