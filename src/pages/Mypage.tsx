import React from 'react';

import Title from 'components/Title';
import Header from 'components/Header';
import Footer from 'components/Footer';
import { getAccessToken, getUserInfo } from 'utility/api';
import { APIGetUserInfoData } from 'utility/types';
import Loading from 'components/Loading';

function Mypage() {
    let [userInfo, setUserInfo] = React.useState<APIGetUserInfoData>();
    let [isLoading, setLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
      getUserInfo(getAccessToken()).then((info) => {
        setUserInfo(info);
        setLoading(false);
      });
    }, []);
    
    if (isLoading) return <Loading/>;
    else return (
        <>
            <Header/>
            <Title title={userInfo.nickname + "님, 오늘도 파이팅!"}/>
            <div className="configzone">

            </div>
            <Footer/>
        </>
    );
}

export default Mypage;
