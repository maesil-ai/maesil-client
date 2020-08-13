import React from 'react';

import Title from 'components/Title';
import Header from 'components/Header';
import Footer from 'components/Footer';
// import BeatLoader from "react-spinners/BeatLoader";

function Loading() {
  return (
    <>
      <Header/>
      <Title title="불러오는 중..." />
      <Footer/>
    </>
  );
}

/*
        spinnerColor='#9ee5f8'
        textColor='#676767'
        text="불러오는 중..."

*/
export default Loading;
