import React from 'react';

import LoadingScreen from 'react-loading-screen'


function Loading() {
  return (
    <LoadingScreen
        loading={true}
        spinnerColor='#9ee5f8'
        textColor='#676767'
        logoSrc='http://www.foodnmed.com/news/photo/201903/18296_3834_4319.jpg'
        text="불러오는 중..."
    />
  );
}

export default Loading;
