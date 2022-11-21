/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/anchor-is-valid */
import './typeDetail.css';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { query, collection, doc, getDoc, getDocs, where } from "firebase/firestore";

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
        if (time.hours == start_hour && time.minutes < start_min){
          console.log("시작시 이고 분 전이다");
          return false;
        }
        else if (time.hours == end_hour && time.minutes > end_min){
          console.log("종료시 이고 분 후이다");
          return false;
        }
        else {
          console.log("영업중이다.")
          return true;
        }
      } else { return false; }
  } else { return false; }
}

function MenuTypeDetailPage() {
  const { id } = useParams();
  const [CafeInfoList, setCafeInfoList] = useState([]);

  useEffect(()=>{
    const fetchMenu = async ( ) => {
      const q = query(
        collection(db, "MenuData"),
        where("type", "==", id)
        );
        
      const querySnapshot = await getDocs(q);
      var cafeArr = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const cafeteria = data.cafeteria;

        if (cafeArr.includes(cafeteria) === false){
          cafeArr.push(cafeteria);
        }
      });

      var infoArr = [];
      for(var i=0; i<cafeArr.length; i++){
        const docRef = doc(db, "CafeteriaData", cafeArr[i]);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
          const data = docSnap.data();
          const {eng_name, name, location, operating_day, operating_hour, phone} = data;
          const open = isOpen(operating_day, operating_hour);
          infoArr.push({eng_name, name, location, operating_day, operating_hour, phone, open});
        }
      }
      setCafeInfoList(infoArr);
    }
    fetchMenu();
  },[]);

  return (
  <div className='container'>
    <div className='container-title'>
      <a href={'/'+id}> {id} </a>
    </div>
    <div className='list'>
      {CafeInfoList.map((item) => {
        return (
          <Link to={'/cafe/' + item.eng_name} className='cafe-container'>
            <img width="80px" src={'/resource/cafe/'+item.eng_name+'.png'} alt={item.name} />
            <div className='cafe-info'>
              <div className='cafe-title'>
                {item.name}
                { item.open === true ? <span className='cafe-open'> 영업중 </span> : <span className='cafe-close'> 영업종료 </span> }
              </div>
              <span> {item.location} </span>
              <div className='cafe-operating'> {item.operating_day} {item.operating_hour} </div>
              <span> Tel. {item.phone} </span>
              
            </div>
          </Link>
        )
      })}
    </div>
  </div>
  );
}
export default MenuTypeDetailPage;