import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from 'react-router-dom';

import React from 'react';

import LoginPage from './pages/login/login';
import SignupPage from './pages/signup/signup';
import MainPage from './pages/main/mainPage';

import TypePage from './pages/menu/typeDetail';
import CafePage from './pages/cafeteria/cafeteriaDetail';

function App() {
  const onClick=() => {
    alert("헬로");
  }
  const onKeyPress = (e) => {
    if(e.key === 'Enter') {
      onClick();
    }
  }
  return (
    <div className='App'>
      <div className='header'>
        <div className='title-container'>
          <div className='title'><a href='/'>꼬르륵</a></div>
          <div className='userbtn'>
            <a href="/login">my page</a>
          </div>
        </div>
        <div className='search-container'>
          <input
            type="text"
            placeholder="검색어 입력"
            onKeyPress={onKeyPress}
          />
          </div>
      </div>

      <Router>
        <Routes>
          <Route path="/" element={<MainPage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/signup" element={<SignupPage/>} />
          <Route path="/:id" element={<TypePage/>} />
          <Route path="/cafe/:id" element={<CafePage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;