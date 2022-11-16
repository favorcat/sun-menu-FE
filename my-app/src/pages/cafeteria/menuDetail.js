/* eslint-disable no-dupe-keys */
/* eslint-disable no-undef */
/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/anchor-is-valid */
import './menuDetail.css';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { query, collection, getDocs, where } from "firebase/firestore";
import { ResponsiveRadar } from '@nivo/radar'
import { Range } from 'react-range';
import axios from 'axios';
  
  function MenuDetailPage() {
    const { id, key } = useParams();
    console.log("menu page id = " + id + key);
    
    const [menuInfo, setMenuInfo] = useState({});
    const [cafeInfo, setCafeInfo] = useState([]);
    useEffect(()=>{
      const fetchMenu = async ( ) => {
        const cafeQuery = query(
          collection(db, "CafeteriaData"),
          where('eng_name', '==', id)
        );
      const cafeSnapshot = await getDocs(cafeQuery);
      cafeSnapshot.forEach((doc) => {
        const { name } = doc.data();
        setCafeInfo({name: name});
      });
      
      const q = query(
        collection(db, "MenuData"),
        where("cafeteria", "==", id),
        where("name", "==", key)
        );
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
          const { name, price, type } = doc.data();
          setMenuInfo({name: name, price: price, type: type});
        });
      }
      fetchMenu();
      getReview();
    },[]);
        
    const [data,setData] = useState([
    {
      "review": "맛",
      "": 3,
    },
    {
      "review": "양",
      "": 3,
    },
    {
      "review": "가격",
      "": 3,
    },
    {
      "review": "청결도",
      "": 3,
    },
    {
      "review": "품질",
      "": 3,
    }
  ]);

  const [review, setReview] = useState({
    cost: [3],
    taste: [3],
    quantity: [3],
    clean: [3],
    quality: [3],
  });
  const reviewList = [
    { eng: 'cost', kor: '가격' },
    { eng: 'taste', kor: '맛' },
    { eng: 'quantity', kor: '양' },
    { eng: 'clean', kor: '청결도' },
    { eng: 'quality', kor: '품질' },
  ];
  
  function getReview(){
    console.log("get reviewwww");
    axios.get(`http://localhost:8000/check/create/${id}/${key}`)
    .then(function (response) {
      console.log(typeof(response.data.avg_cost));
      console.log(response.data);
      setData([
        {
          "review": "맛",
          "": response.data.avg_taste,
        },
        {
          "review": "양",
          "": response.data.avg_quantity,
        },
        {
          "review": "가격",
          "": response.data.avg_cost,
        },
        {
          "review": "청결도",
          "": response.data.avg_clean,
        },
        {
          "review": "품질",
          "": response.data.avg_quality,
        }
      ]);
      console.log(data);
    }).catch(function (error) {
        console.log(error);
    });
  }
  function postReview(){
    console.log("submit");
    axios.post('http://localhost:8000/check/create/',
    {
      'user': 1,
      'menu_name': key,
      'cafeteria_name': id,
      'cost': review.cost[0],
      'taste': review.taste[0],
      'quantity': review.quantity[0],
      'clean': review.clean[0],
      'quality': review.quality[0],
    }).then(function (response) {
      console.log("리뷰 보내기 성공!");
      console.log(response.data);
      getReview();
      }).catch(function (error) {
        console.log(error);
      }
    );
  }

  return (
  <div className='container'>
    <div className='menuDetail'>
      <div className='cafeteria-title'>
        <a href={"/cafe/"+id}>{cafeInfo.name}</a>
      </div>
      <div className='menu-title'>
        {menuInfo.name}
      </div>
      <span className='menu-price'> {menuInfo.price}원</span>
      <div className='menu-type'>
        <div className='type-btn' id={'type-'+menuInfo.type}>{menuInfo.type}</div>
      </div>
    </div>
    <div className='review-container'>
      <div style={{ width: 'auto', height: '300px', margin: '0' }}>   
      <ResponsiveRadar
        data={data}
        keys={['']}
        indexBy="review"
        maxValue={5}
        valueFormat=" >-.2f"
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        borderColor={{ from: 'color', modifiers: [] }}
        gridShape="linear"
        gridLabelOffset={16}
        dotSize={10}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={2}
        colors={{ scheme: 'pastel1' }}
        fillOpacity={1}
        blendMode="multiply"
        motionConfig="wobbly"
        legends={[
            {
                anchor: 'top-left',
                direction: 'column',
                translateX: -50,
                translateY: -40,
                itemWidth: 80,
                itemHeight: 20,
                itemTextColor: '#999',
                symbolSize: 12,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000'
                        }
                    }
                ]
            }
        ]}
    />
      </div>
    </div>
      <div className="review-form-container">
        {reviewList.map((item) => {
          return(
          <div className="review-form">
            <div className="form-title">{item.kor}</div>
            <Range
              step={1}
              min={1}
              max={5}
              values={review[item.eng]}
              onChange={(values) => {setReview({...review, [item.eng]: values})}}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: '4px',
                    width: '100%',
                    backgroundColor: '#ffccbb'
                  }}
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    borderRadius: '12px',
                    height: '14px',
                    width: '14px',
                    backgroundColor: '#ffbbcc'
                  }}
                />
              )}
            />
          </div>
        )})}
        <button className="submit-review" onClick={postReview}>리뷰 남기기</button>
      </div>
  </div>
  );
}
export default MenuDetailPage;