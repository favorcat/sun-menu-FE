import React from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useLocation } from 'react-router-dom';

import './login.css';

// function edit(){
//   console.log("submit");
//   axios.put('https://api.favorcat.dev/api/get_post/1',{
//       title: "aaaaa",
//       contents: "bbbbbb",
//       writer: "2",
//   })
//   .then(function (response) {
//     console.log(response);
//   }).catch(function (error) {
//     console.log(error);
//   });
//   console.log("submit========================");

// }

function LoginPage() {
  const [account, setAccount] = React.useState({
    username: '',
    password: '',
  });

  const [cookies, setCookie] = useCookies(['token']);

  function login(usr, pw){
    axios.post('https://api.favorcat.dev/rest-auth/login/',{
      username: usr,
      password: pw,
    })
    .then(function (response) {
      if (response.status === 200){
        setCookie('token', response.data.token, { path: '/', maxAge: 1000 * 60 * 60 * 12, sameSite: 'strict' });
        window.location.href = '/';
      } else {
        window.alert("로그인 실패, 다시 시도해주세요");
      }
    }).catch(function (error) {
      window.alert("로그인 에러");
    });
  }

  return (
  <div className='container'>
    <div className='login-container'>
      <div className='login-title'>로그인</div>
      <div className='login-input'>
        <input type='text' onChange={(e) =>{setAccount({...account, "username" : e.target.value})}} placeholder=' 아이디'/>
        <input type='password' onChange={(e) =>{setAccount({...account, "password" : e.target.value})}} placeholder=' 비밀번호'/>
      </div>
    <div className='login-register'>
      <button className='login-btn' onClick={() => login(account.username, account.password)}>로그인</button>
      <a href='/register'>회원가입</a>
    </div>
    </div>
  </div>
  );
}
export default LoginPage;