import React from 'react';

import Title from 'components/Title';
import Header from 'components/Header';
import Footer from 'components/Footer';
import { postUserInfo } from 'utility/api';
import { Redirect } from 'react-router-dom';
import InfoForm from 'components/InfoForm';
import { mainLogo } from 'utility/svg';

function Signup() {
  let [status, setStatus] = React.useState<number>(0);

  const handleSubmit = async (name: string, sex: string, height: number, weight: number) => {
    await postUserInfo(name, sex, height, weight);
    setStatus(1);
  }

  if (status) return <Redirect to="/tutorial" />;
  else
    return (
      <>
        <Header />
        <div className="zone">
          <div>
            { mainLogo }
          </div>
          <div style={{paddingBottom: '32px'}} />
          <h1> 환영합니다! </h1>
          <div style={{paddingBottom: '16px'}} />
          <div>
            매일매일 건강 트레이닝 "매실"에 가입해주셔서 감사합니다. 
            <br/>
            가입을 완료하시려면 아래 정보를 채워 주세요.
          </div>
          <div style={{paddingBottom: '75px'}} />
          <InfoForm onSubmit={handleSubmit} buttonMessage='가입'/>
        </div>
        <Footer />
      </>
    );
}

export default Signup;
