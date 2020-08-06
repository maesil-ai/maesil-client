import React from 'react';

import Title from 'components/Title';
// import BeatLoader from "react-spinners/BeatLoader";

function Loading() {
  return (
    <div>
      <Title title="불러오는 중..." />
    </div>
  );
}

/*
        spinnerColor='#9ee5f8'
        textColor='#676767'
        text="불러오는 중..."

*/
export default Loading;
