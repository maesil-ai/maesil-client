import React from 'react';

import Title from 'components/Title';
import Header from 'components/Header';
import Footer from 'components/Footer';

function Signup() {
  return (
    <div>
        <Header/>
        <Title title="반갑습니다!"/>
        <div className="configzone">
            매일매일 건강 트레이닝 "매실"에 가입해주셔서 감사합니다. 가입을 완료하시려면 아래 정보를 채워 주세요. 제공하신 정보는 저희 마음대로 써먹겠습니다. 감사합니다.
            <div>
                이름 <input/>
            </div>
            <div>
                성별 <input/>
            </div>
            <div>
                나이 <input/>
            </div>
            <div>
                키 <input/>
            </div>
            <div>
                몸무게 <input/>
            </div>
            <button>가입</button>
        </div>
        <Footer/>
    </div>
  );
}

export default Signup;
