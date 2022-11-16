import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useCookies } from 'react-cookie';

import React from 'react';
import axios from 'axios';

import LoginPage from './pages/login/login';
import SignupPage from './pages/register/register';
import MainPage from './pages/main/mainPage';

import TypePage from './pages/menu/typeDetail';
import CafePage from './pages/cafeteria/cafeteriaDetail';

function App() {
  // const location = useLocation()
  const location = window.location.pathname;
  const [cookie, setCookie, removeCookie] = useCookies(['token']);

  // React.useEffect(() => { // useEffect가 location이 바뀔 때마다 실행됨
  //   if (cookie.token) { // 만약 토큰이 존재하면
  //     // 토큰 검증을 함
  //     axios.get('http://localhostㄹ:8000/api/verifytoken', { headers: { Authorization: `Bearer ${cookie.token}` } })
  //       .then((res) => {
  //         // 요청 성공 시 그냥 지나감
  //         console.log(res.data);
  //       })
  //       .catch((err) => {
  //         // 에러 발생 시 쿠키 삭제
  //         removeCookie('token');
  //       })
  //   }
  // }, [location])

  function logout(){
    removeCookie('token');
    window.location.href = '/';
  }

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
            {cookie.token != null
            ? <div>
              {/* <a href='/mypage'>마이페이지</a> */}
              <button className="logout" onClick={logout}> 로그아웃</button>
              </div>
            : <a className="login" href='/login'>로그인</a>}
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
          <Route path="/register" element={<SignupPage/>} />
          <Route path="/:id" element={<TypePage/>} />
          <Route path="/cafe/:id" element={<CafePage/>}/>
          <Route path="/cafe/:id/:key" element={<MenuDetailPage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;