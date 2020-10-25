import React from 'react';

import Title from 'components/Title';
import Header from 'components/Header';
import Footer from 'components/Footer';
import { getAccessToken, getUserInfo, getLikes, getExercise } from 'utility/api';
import { APIGetUserInfoData, ContentData } from 'utility/types';
import Loading from 'pages/Loading';
import { Redirect } from 'react-router-dom';
import Shelf from 'components/Shelf';
import Tabs from 'components/Tabs';
import usePromise from 'utility/usePromise';

function Mypage() {
  let [userInfoLoading, userInfo] = usePromise<APIGetUserInfoData>(getUserInfo);
  let [likesLoading, likes] = usePromise<ContentData[]>(getLikes);

  if (!getAccessToken()) return <Redirect to="/" />;
  if (userInfoLoading || likesLoading) return <Loading />;
  else
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
          <h1> { userInfo.nickname }님, 오늘도 파이팅! </h1>
          <div style={{marginBottom: '48px'}} />
          <table style={{width: '50%', margin: 'auto'}}>
            <tbody>
              <tr style={{height: '48px'}}>
                <td className='labelColumn'> 레벨 </td>
                <td className='contentColumn'> { userInfo.level } </td>
              </tr>
              <tr style={{height: '48px'}}>
                <td className='labelColumn'> 키 </td>
                <td className='contentColumn'> { userInfo.height } </td>
              </tr>
              <tr style={{height: '48px'}}>
                <td className='labelColumn'> 몸무게 </td>
                <td className='contentColumn'> { userInfo.weight } </td>
              </tr>
              <tr style={{height: '48px'}}>
                <td className='labelColumn'> 성별 </td>
                <td className='contentColumn'> { userInfo.gender } </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Shelf title={`${userInfo.nickname}님이 좋아하는 운동들`} contents={likes} />
        <Footer />
      </>
    );
}

export default Mypage;
