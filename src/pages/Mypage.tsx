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

function Mypage() {
  let [userInfo, setUserInfo] = React.useState<APIGetUserInfoData>();
  let [isLoading, setLoading] = React.useState<boolean>(true);
  let [likes, setLikes] = React.useState<ContentData[]>([]);

  React.useEffect(() => {
    Promise.all([getUserInfo(), getLikes()]).then(([info, likes]) => {
      setUserInfo(info);

      Promise.all(likes.map((content) => getExercise(content.id))).then((likes) => {
        setLikes(likes.filter((content) => content != null));
        setLoading(false);  
      });
    });
  }, []);

  if (!getAccessToken()) return <Redirect to="/" />;
  if (isLoading) return <Loading />;
  else
    return (
      <>
        <Header />
        <Tabs data={[{
          name: "정보",
          link: "/mypage/info",
          active: true,
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
