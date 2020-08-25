import React from 'react';

import Title from 'components/Title';
import Header from 'components/Header';
import Footer from 'components/Footer';
import { postUserInfo, getUserInfo } from 'utility/api';
import InfoForm from 'components/InfoForm';
import Loading from 'pages/Loading';
import usePromise from 'utility/usePromise';
import { APIGetUserInfoData } from 'utility/types';

function Modify() {
  let [loading, userInfo, error] = usePromise<APIGetUserInfoData>(getUserInfo);

  const handleSubmit = async (name: string, sex: string, height: number, weight: number, setMessage: (string) => void) => {
    let result = postUserInfo(name, sex, height, weight);
    if (result) setMessage('수정 완료!');
    else setMessage('수정 실패...');
  }

  if (loading) return <Loading/>;
  else if (error) return (
    <>
      <Header />
      <Footer />
    </>
  );
  else
    return (
      <>
        <Header />
        <Title title="정보 수정" />
        <div className="zone">
          <InfoForm defaultInfo={userInfo} onSubmit={handleSubmit} buttonMessage='수정'/>
        </div>
        <Footer />
      </>
    );
}

export default Modify;
