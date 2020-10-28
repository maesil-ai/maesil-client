import React from 'react';

import Title from 'components/Title';
import Header from 'components/Header';
import Footer from 'components/Footer';
import { getAccessToken, getUserInfo, getLikes, getExercise, getDailyRecords, getRecord } from 'utility/api';
import { APIGetUserInfoData, ContentData, DailyRecordData } from 'utility/types';
import Loading from 'pages/Loading';
import { Redirect } from 'react-router-dom';
import Shelf from 'components/Shelf';
import Tabs from 'components/Tabs';
import usePromise from 'utility/usePromise';
import { mainLogo } from 'utility/svg';
import { useSelector } from 'react-redux';
import { RootReducerState } from 'reducers';

function Mypage() {
  let [userInfoLoading, userInfo] = usePromise<APIGetUserInfoData>(getUserInfo);
  let [likesLoading, likes] = usePromise<ContentData[]>(getLikes);
  let [dailyRecordsLoading, dailyRecords] = usePromise<DailyRecordData[]>(getDailyRecords);

  if (!getAccessToken()) return <Redirect to="/" />;
  if (userInfoLoading || likesLoading || dailyRecordsLoading) return <Loading />;
  else {
    let record = getRecord(dailyRecords, new Date());
    return (
      <>
        <Header />
        <Tabs data={[{
          name: "정보",
          link: "/mypage/info",
          active: true,
        }, {
          name: "운동 기록",
          link: "/mypage/record",
          active: false,
        }, {
          name: "내 채널",
          link: `/user/${userInfo.nickname}`,
          active: false,
        }]} />
        <div className="zone">
          <div>
            <img src={ userInfo.profile_image } style={{width: '300px', height: '300px'}}/>
          </div>
          <div style={{paddingBottom: '32px'}} />
          <h1> { userInfo.nickname }님, 오늘도 파이팅! </h1>
          <div style={{marginBottom: '48px'}} />
          <table style={{width: '50%', margin: 'auto'}}>
            <tbody>
              <tr style={{height: '48px'}}>
                <td className='labelColumn'> 오늘 운동한 시간 </td>
                <td className='contentColumn'> { record.playTime } </td>
              </tr>
              <tr style={{height: '48px'}}>
                <td className='labelColumn'> 오늘 소모한 칼로리 </td>
                <td className='contentColumn'> { record.calorie } </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{marginBottom: '48px'}} />
        <div style={{display: 'flex', margin: '40px'}}>
          { [0, 1, 2, 3, 4, 5, 6].map((before) => {
            const dateObject = new Date(Date.now() - 24*60*60*1000*before);
            const year = dateObject.getFullYear(), month = dateObject.getMonth() + 1, date = dateObject.getDate();
            const record = getRecord(dailyRecords, dateObject);
            return (
              <div className="zone" style={{margin: '10px', padding: '10px'}}>
                <div style={{marginBottom: '8px'}} />
                <table style={{width: '100%', margin: '5px auto'}}>
                  <tbody>
                    <tr style={{height: '48px'}}>
                      <td className='labelColumn center'> { `${year}년 ${month}월 ${date}일` } </td>
                    </tr>
                    <tr style={{height: '48px'}}>
                      <td className='contentColumn center'> { record.playTime } </td>
                    </tr>
                    <tr style={{height: '48px'}}>
                      <td className='contentColumn center'> { record.calorie }kcal 소모 </td>
                    </tr>
                  </tbody>
                </table>
                <div style={{marginBottom: '-16px'}} />
              </div>  
            );
          })
          }
        </div>
        <Shelf title={`${userInfo.nickname}님이 좋아하는 운동들`} contents={likes} />
        <Footer />
      </>
    );
  }
}

export default Mypage;
