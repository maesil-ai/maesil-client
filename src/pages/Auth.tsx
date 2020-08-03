import React from 'react';

import Header from 'components/Header';
import Footer from 'components/Footer';
import Title from 'components/Title';
import Axios from 'axios';

interface AuthProps {

};

function Auth({ } : AuthProps) {

  let getClientId = async (accessToken : string) => {
    const resUserInfo = await Axios.get('https://api.maesil.ai/auth')
  }

  return (
    <>
      <Header/>
      <Title title="로그인 성공! 이 페이지는 로그인하는 데에 성공한 뒤에 보여지는 임시적인 페이지입니다. 이 페이지에서 인증 정보를 서버에서 받아오고 다시 원래 보던 페이지로 되돌릴 예정입니다."/>
      <Footer/>
    </>
  )
}

export default Auth;
