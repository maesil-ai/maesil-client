import React from 'react';

import Title from 'components/Title';
import Header from 'components/Header';
import Footer from 'components/Footer';
import { postUserInfo, getUserInfo } from 'utility/api';
import InfoForm from 'components/InfoForm';
import Loading from 'components/Loading';
import usePromise from 'utility/usePromise';
import { APIGetUserInfoData } from 'utility/types';

function Modify() {
  let [loading, userInfo, error] = usePromise<APIGetUserInfoData>(getUserInfo);

  const handleSubmit = async (name: string, sex: string, height: number, weight: number, setMessage: (string) => void) => {
    let result = postUserInfo(name, sex, height, weight);
    if (result) setMessage('수정 완료!');
    else setMessage('수정 실패...');
  }

  if (loading) return (
    <>
      <Header />
      <Loading />
      <Footer />
    </>
  );
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
        <Title title="설정" />
        <div className="zone">
          <div>
            정보 수정
          </div>
          <InfoForm defaultInfo={userInfo} onSubmit={handleSubmit} buttonMessage='수정'/>
        </div>
        <Footer />
      </>
    );
}

export default Modify;
