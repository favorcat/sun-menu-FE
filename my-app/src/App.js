import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react';
import MainPage from './pages/main/mainPage';

function App() {
  return (
    <div className='App'>
      <div className='header'>
        <div className='title'>꼬르륵</div>
        <div className='userbtn'>
          리뷰 마이페이지
        </div>
        <div className='search-container'></div>
      </div>

      <Router>
        <Routes>
          <Route path="/" element={<MainPage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;