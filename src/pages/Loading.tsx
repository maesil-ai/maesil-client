import React from 'react';

import Title from 'components/Title';
import Header from 'components/Header';
import Footer from 'components/Footer';
// import BeatLoader from "react-spinners/BeatLoader";

interface LoadingProps {
  headerReal?: boolean;
};

function Loading({ headerReal = true } : LoadingProps) {
  return (
    <>
      <Header real={headerReal}/>
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
