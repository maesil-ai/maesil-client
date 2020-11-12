import LoginButton from 'components/LoginButton';
import React from 'react';

function Hello() {

  return (
      <>
        <div className='banner' >
          <img className='bannerImage' src='https://maesil-storage.s3.ap-northeast-2.amazonaws.com/main.png' />
          <div className='bannerTitle'>
            매일매일 실내 트레이닝
          </div>
          <div className='bannerText'>
            누구나 운동을 만들고 트레이닝할 수 있는 
            <br/>
            새로운 실내 헬스 트레이닝 플랫폼
          </div>
          <div className='bannerText' style={{transform: 'translateY(72px)'}}> <LoginButton /> </div>
        </div>
      </>
    );
}

export default Hello;
