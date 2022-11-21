/* eslint-disable eqeqeq */
import React from 'react';
import axios from 'axios';
import './register.css';


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

function register(usr, email, pw1, pw2){
  if (pw1 == pw2){
    if (pw1.length < 8){
      window.alert("비밀번호는 8자 이상이어야 합니다.");
    } else{
      axios.post('https://api.favorcat.dev/rest-auth/registration/',{
        username: usr,
        email: email,
        password1: pw1,
        password2: pw2,
      })
      .then(function (response) {
        if (response.status === 201){
          console.log(response);
          console.log("register success");
          window.alert("회원가입");
          window.location.href = '/login';
        } else {
          console.log(response);
          window.alert("회원가입 실패, 다시 시도해주세요");
        }
      }).catch(function (error) {
        console.log(error);
        window.alert("회원가입 에러");
      });
    }
  } else{
    window.alert("비밀번호가 일치하지 않습니다.");
  }

}

function SignupPage() {
  const [account, setAccount] = React.useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
  });

  return (
  <div className='container'>
    <div className='register-container'>
      <div className='register-title'>회원가입</div>
      <div className='register-input'>
        <input type='text' onChange={(e) =>{setAccount({...account, "username" : e.target.value})}} placeholder=' 아이디'/>
        <input type='password' onChange={(e) =>{setAccount({...account, "password1" : e.target.value})}} placeholder=' 비밀번호'/>
        <input type='password' onChange={(e) =>{setAccount({...account, "password2" : e.target.value})}} placeholder=' 비밀번호 확인'/>
        <input type='text' onChange={(e) =>{setAccount({...account, "email" : e.target.value})}} placeholder=' 이메일'/>
      </div>
    <div className='register-login'>
      <button className='register-btn' onClick={() => register(account.username, account.email, account.password1, account.password2)}>회원가입</button>
      <a href='/login'>로그인</a>
    </div>
    </div>
  </div>
  );
}
export default SignupPage;