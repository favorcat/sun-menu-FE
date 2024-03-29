/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/anchor-is-valid */
import './mainPage.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import { db } from '../../firebase';
// import { query, collection, getDocs } from "firebase/firestore";
// import KakaoMapScript from '../location/kakaoMap';
import { Map, MapMarker,CustomOverlayMap } from "react-kakao-maps-sdk";

function capitalizeFirstLetter(str) {
  return str[0].toUpperCase() + str.slice(1);
}

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

    if (dayStr ==='평일' && time.day >= 1 && time.day <= 5){
      if (start_hour <= time.hours && time.hours <= end_hour){
        if (time.hours == start_hour && time.minutes < start_min){ return false; }
        else if (time.hours == end_hour && time.minutes > end_min){ return false; }
        else { return true; }
      } else { return false; }
  } else { return false; }
}

function MainPage() {
  const remote = ["메뉴", "교내", "도시락존"];
  const NewMenuList = [
    { name: '한식', url: 'korean' },
    { name: '분식', url: 'snack' },
    // { name: '양식', url: 'weatern', image: 'https://picsum.photos/200' },
    // { name: '중식', url: 'chinese', image: 'https://picsum.photos/200' },
    { name: '일식', url: 'japansese' },
    { name: '패스트푸드', url: 'fastfood' }
  ]

  // const storage = getStorage();
  // const pathReference = ref(storage, 'cafe/newyork.png');

  const [CafeInfoList, setCafeInfoList] = useState([]);

  useEffect(()=>{
    const fetchMenu = async ( ) => {
      var infoArr = [];
      // const q = query(collection(db, "CafeteriaData"));
      // const querySnapshot = await getDocs(q);
      // querySnapshot.forEach((doc) => {
      //   const data = doc.data();
      //   const {eng_name, name, location, operating_day, operating_time, phone} = data;
      //   const open = isOpen(operating_day, operating_time);
      //   infoArr.push({eng_name, name, location, operating_day, operating_time, phone, open});
      // });
      axios.get(`https://api.favorcat.dev/check/cafe/`)
      .then(function (response){
        const data = response.data;
        for(var i=0; i<data.length; i++){
          const { eng_name, kor_name, location, phone, operating_day, operating_time, lat, lng  } = data[i];
          const open = isOpen(operating_day, operating_time);
          infoArr.push({eng_name, kor_name, location, operating_day, operating_time, phone, open});
        }
        setCafeInfoList(infoArr.sort((a,b) => b.kor_name.localeCompare(a.kor_name)));
      });
    }
    fetchMenu();
    // KakaoMapScript();
  },[]);

  // const [position, setPosition] = useState({});
  const markerdata = [
    {
      title: "원화관 서문",
      lat: 36.800076,
      lng: 127.076565
    },
    {
      title: "인문관 북쪽",
      lat: 36.799328,
      lng: 127.075970
    },
    {
      title: "인문관 남쪽",
      lat: 36.7982834,
      lng: 127.076014
    },
    {
      title: "학생회관 CU 앞, 지하 1층, 야외",
      lat: 36.797543,
      lng: 127.077178
    },
    // {
    //   title: "학생회관 코나킹 야외",
    //   lat: 36.797661,
    //   lng: 127.076562
    // },
    {
      title: "보건관 1층",
      lat: 36.7991554,
      lng: 127.078345
    },
  ];


  return (
  <div className='container'>
    {/* <>
        <Map // 지도를 표시할 Container
        center={{
          // 지도의 중심좌표
          lat: 36.798860,
          lng: 127.07555,
        }}
        style={{
          width: "100%",
          height: "350px",
        }}
        level={4} // 지도의 확대 레벨
        onClick={(_t, mouseEvent) => setPosition({
          lat: mouseEvent.latLng.getLat(),
          lng: mouseEvent.latLng.getLng(),
        })}
        >
        {position && <MapMarker position={position} />}
        </Map>
        {position && <span>{'클릭한 위치의 위도는 ' + position.lat + ' 이고, 경도는 ' + position.lng + ' 입니다'}</span>}
      </> */}
    {/* <div id='myMap' style={{
      width: "100%",
      height: "350px"
    }}></div> */}
    <div className='btn-container'>
      {remote.map((item) => {
        return (
          <div className='type-btn'>
            <a href={'#'+item}> { item } </a>
          </div>
        )
      })}
    </div>
    <div className='list' id="메뉴">
      <span className='container-title'>메뉴</span>
      <div className='type-container'>
        {NewMenuList.map((item) => {
          return (
              <Link to={'/'+item.name} className='type'>
                <img width="80px" src={'/resource/type/'+item.url+'.png'} alt={item.name} />
                <span> { `${item.name} (${capitalizeFirstLetter(item.url)})` } </span>
              </Link>
          )
        })}
      </div>
    </div>

    <div className='list' id="교내">
      <span className='container-title'>교내 식당</span>
        {CafeInfoList.map((item) => {
        return (
          <Link to={'/cafe/' + item.eng_name} className='cafe-container'>
            <img width="80px" src={'/resource/cafe/'+item.eng_name+'.png'} alt={item.kor_name} />
            <div className='cafe-info'>
              <div className='cafe-title'>
                {item.kor_name}
                { item.open === true ? <span className='cafe-open'> 영업중 </span> : <span className='cafe-close'> 영업종료 </span> }
              </div>
              <span> {item.location} </span>
              <div className='cafe-operating'> {item.operating_day} {item.operating_time} </div>
              <span> Tel. {item.phone} </span>
              
            </div>
          </Link>
        )
      })}
    </div>
    <div className='list' id="도시락존">
      <span className='container-title'>도시락존</span>
      <Map
        center={{ lat: 36.798860, lng: 127.07545, }}
        style={{width: "100%", height: "300px" }}
        level={4}
        zoomable={false}
      >
      {markerdata.map((position, index) => (
        <>
            <MapMarker
                key={position.title}
                position={{ lat: position.lat, lng: position.lng }}
                image={{
                    src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png", // 마커이미지의 주소입니다
                    size: {
                        widht: 24,
                        height: 35
                    } // 마커이미지의 크기입니다
                }}
                title={position.title} // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                >
            </MapMarker>
            <CustomOverlayMap
              position={{ lat: position.lat, lng: position.lng }}>
              <a id="pos">{position.title}</a>
            </CustomOverlayMap>
        </>
      ))}
      </Map>
    </div>
  </div>
  );
}
export default MainPage;