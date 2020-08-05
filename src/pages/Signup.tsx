import React from 'react';

import Title from 'components/Title';
import Header from 'components/Header';
import Footer from 'components/Footer';
import { postUserInfo, getAccessToken } from 'utility/api';

function Signup() {
    let [name, setName] = React.useState<string>("");
    let [sex, setSex] = React.useState<string>("");
    let [height, setHeight] = React.useState<string>("");
    let [weight, setWeight] = React.useState<string>("");

    const submit = () => {
        postUserInfo(getAccessToken(), name, sex, Number.parseInt(height), Number.parseInt(weight));
    }

    return (
        <>
            <Header/>
            <Title title="반갑습니다!"/>
            <div className="configzone">
                매일매일 건강 트레이닝 "매실"에 가입해주셔서 감사합니다. 가입을 완료하시려면 아래 정보를 채워 주세요. 제공하신 정보는 저희 마음대로 써먹겠습니다. 감사합니다.
                <div>
                    이름 <input onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    성별 <input onChange={(e) => setSex(e.target.value)} />
                </div>
                <div>
                    키 <input onChange={(e) => setHeight(e.target.value)} />
                </div>
                <div>
                    몸무게 <input onChange={(e) => setWeight(e.target.value)} />
                </div>
                <button onClick={submit}>가입</button>
            </div>
            <Footer/>
        </>
    );
}

export default Signup;
