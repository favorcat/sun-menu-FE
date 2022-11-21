/* eslint-disable no-undef */
/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/anchor-is-valid */
import './cafeteriaDetail.css';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { query, collection, getDocs, where } from "firebase/firestore";
import axios from 'axios';
// import { Map, MapMarker,CustomOverlayMap } from "react-kakao-maps-sdk";


function isOpen(dayStr, timeStr){
  const date = new Date();
    const time = {
      day: date.getDay(),
      hours: date.getHours(),
      minutes: date.getMinutes(),
    };
    timeStr = timeStr+" ";
    const start_hour = timeStr.substr(0,2); // 시작 시
    const start_min = timeStr.substr(3,2); // 시작 분
    const end_hour = timeStr.substr(6,2); // 종료 시
    const end_min = timeStr.substr(9,2); // 종료 분

    if ((dayStr ==='평일' && time.day >= 1 && time.day <= 5) || (dayStr ==='매일')){
      console.log("평일");
      if (start_hour <= time.hours && time.hours <= end_hour){
        if (time.hours == start_hour && time.minutes < start_min){ return false; }
        else if (time.hours == end_hour && time.minutes > end_min){ return false; }
        else { return true; }
      } else { return false; }
  } else { return false; }
}

function CafeteriaDetailPage() {
  const { id } = useParams();

  const [menuList, setMenuList] = useState([]);
  const [TypeList, setTypeList] = useState([]);
  const [cafeInfo, setCafeInfo] = useState([]);
  const [cafeOpen, setCafeOpen] = useState();

  useEffect(()=>{
    const fetchMenu = async ( ) => {
      // const cafeQuery = query(
      //   collection(db, "CafeteriaData"),
      //   where('eng_name', '==', id)
      // );
      // const cafeSnapshot = await getDocs(cafeQuery);
      // cafeSnapshot.forEach((doc) => {
      //   const { name, eng_name, lat, lng, location, phone, operating_day, operating_hour } = doc.data();

      //   setCafeInfo({name: name, eng_name: eng_name, lat: lat, lng: lng, location: location, phone: phone, operating_day: operating_day, operating_hour: operating_hour});
        
        axios.get(`http://localhost:8000/check/cafe/${id}`)
        .then(function (response){
          const { kor_name, eng_name, lat, lng, location, phone, operating_day, operating_time, notice_contents, notice_registered } = response.data;
          setCafeInfo({name: kor_name, eng_name: eng_name, lat: lat, lng: lng, location: location, phone: phone, operating_day: operating_day, operating_time: operating_time, notice_contents: notice_contents, notice_registered: notice_registered});
          if (isOpen(operating_day, operating_time) === true){
            setCafeOpen(true);
            console.log("열림");
          } else { setCafeOpen(false); }
        });
      // });
      

      var menuArr = [];
      var typeArr = [];

      if (id === 'staffcafe'){
        const q = query(
          collection(db, "StaffMenuData")
        );
          
        const querySnapshot = await getDocs(q);
      
        querySnapshot.forEach((doc) => {
          const { date, day, idx, menu } = doc.data(); 
          menuArr.push({date: date, day: day, idx: idx, menu: menu});
        });
        setMenuList(menuArr.sort((a, b) => a.idx.localeCompare(b.idx)));
      }
      else {
        axios.get(`http://localhost:8000/check/menu/${id}`)
        .then(function (response){
          for(var i=0; i<response.data.length; i++){
            const { menu_name, price, type } = response.data[i];
            menuArr.push({name: menu_name, price: price, type: type});
            if (typeArr.includes(type) === false){
              typeArr.push(type);
            }
          }
          setMenuList(menuArr.sort((a, b) => b.type.localeCompare(a.type)));
          setTypeList(typeArr.sort((a, b) => b.localeCompare(a)));
        });
        // const q = query(
        //   collection(db, "MenuData"),
        //   where("cafeteria", "==", id)
        // );
        // const querySnapshot = await getDocs(q);

        // querySnapshot.forEach((doc) => {
        //   const { name, price, type } = doc.data();
    
        //   menuArr.push({name: name, price: price, type: type});
        //   if (typeArr.includes(type) === false){
        //     typeArr.push(type);
        //   }
        // });
        
        // if (isOpen(operating_day, operating_hour) === true){
        //   setCafeOpen(true);
        //   console.log("열림");
        // } else { setCafeOpen(false);
        //   console.log("닫힘"); }
          
        // axios.get(`http://localhost:8000/check/menu/${id}`)
        // .then(function (response){
        //   console.log(response.data);
        // });
        
        // setMenuList(menuArr.sort((a, b) => b.type.localeCompare(a.type)));
        // setTypeList(typeArr.sort((a, b) => b.localeCompare(a)));
      }
    }
    fetchMenu();
  },[]);

  return (
  <div className='container'>
    <div className='cafeteria-container'>
      <div className='cafeteria-title'>
        <a href={"/cafe/"+id}>{cafeInfo.name}</a>
      </div>
      { cafeOpen === true ? <div className='cafeteria-open'> 영업중 </div> : <div className='cafeteria-close'> 영업종료 </div> }
      <div className='cafeteria-info'>
        <div className='cafeteria-sub'>
          <span>영업시간</span>
          <span>전화번호</span>
          <span>위치</span>
        </div>
        <div className='cafeteria-content'>
          <span>{cafeInfo.operating_day} {cafeInfo.operating_time}</span>
          <a href={'tel:'+cafeInfo.phone}>{cafeInfo.phone}</a>
          <span>{cafeInfo.location}</span>
        </div>
      </div>
      <>
      <br/>
      <a>{cafeInfo.notice_contents}</a>
      </>
    </div>

    { id === 'staffcafe'
    ? <div className='container'>
        <div className='day-btn-container'>
          {menuList.map((item) => {
            return (
                <a className='day-btn' id={ 'type-'+item.day } href={'#'+item.day}> { item.date } </a>
            )
          })}
        </div>
        <div className='list'>
        {menuList.map((item, i) => {
          return (
                <div className='menu-container' id={ item.day } key={i}>
                  <div className='menu-info'>
                    <a> { item.date } { item.day } </a>
                  </div>
                  {item.menu.map((menu) => {
                    return (
                      <div className='menu-content'>
                        <a> { menu } </a>
                      </div>
                  )})}
                </div>
            )
        })}
        </div>
      </div>
    : <div className='container'>
        <div className='btn-container'>
          {TypeList.map((item) => {
            return (
                <a className='type-btn' id={ 'type-'+item } href={'#'+item}> { item } </a>
            )
          })}
        </div>
        <div className='list'>
        {menuList.map((item, i) => {
          return (
                <Link to={'/cafe/'+ id + '/' + item.name} className='menu-container' id={ item.type } key={i}>
                  <div className='menu-info'>
                    <span> { item.name } </span>
                    <span> { item.price }원 </span>
                  </div>
                  <div className='menu-tag'>
                    <div className='type-btn' id={ 'type-'+item.type }> { item.type } </div>
                    <span>JMT</span>
                    <span>별점</span>
                  </div>
                </Link>
            )
        })}
        </div>
      </div>
    }
    {/* <Map
      center={{ lat: 36.798860, lng: 127.07545, }}
      style={{ width: "100%", height: "350px" }}
      level={4}
      zoomable={false}
    >
      <MapMarker
        key={cafeInfo.title}
        position={{ lat: cafeInfo.lat, lng: cafeInfo.lng }}
        image={{
            src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png", // 마커이미지의 주소입니다
            size: {
                widht: 24,
                height: 35
            } // 마커이미지의 크기입니다
        }}
        title={cafeInfo.title} // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        >
      </MapMarker>
    </Map> */}

  </div>
  );
}
export default CafeteriaDetailPage;