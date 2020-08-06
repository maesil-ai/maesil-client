import React from 'react';

import Title from 'components/Title';
import Header from 'components/Header';
import Footer from 'components/Footer';
import { postUserInfo, getAccessToken } from 'utility/api';
import { Redirect } from 'react-router-dom';

function Signup() {
    let [name, setName] = React.useState<string>("");
    let [sex, setSex] = React.useState<string>("");
    let [height, setHeight] = React.useState<string>("");
    let [weight, setWeight] = React.useState<string>("");
    let [status, setStatus] = React.useState<number>(0);
    let [message, setMessage] = React.useState<string>("");

    const sexList = ['여성', '남성', '기타'].sort(() => Math.random() - 0.5);

    const submit = () => {
        if (name.length < 1) {
            setMessage('이름을 적어 주세요.');
        } else if (name.length > 50) {
            setMessage('이름은 최대 50글자로 해 주세요.');
        } else if (!sexList.find((value) => value == sex)) {
            setMessage('성별을 골라 주세요.');
        } else if (!Number.isInteger(height) || height.length < 2 || height.length > 5) {
            setMessage('키는 10cm에서 99999cm 사이로 적어 주세요.');
        } else if (!Number.isInteger(weight) || weight.length < 2 || weight.length > 5) {
            setMessage('체중은 10kg에서 99999kg 사이로 적어 주세요.');
        } else {
            postUserInfo(getAccessToken(), name, sex, Number.parseInt(height), Number.parseInt(weight));
            setStatus(1);
        }
    }
    
    if (status) return (
        <Redirect to="/"/>
    );
    else return (
        <>
            <Header/>
            <Title title="반갑습니다!"/>
            <div className="zone">
                <div>
                    매일매일 건강 트레이닝 "매실"에 가입해주셔서 감사합니다. 가입을 완료하시려면 아래 정보를 채워 주세요.
                </div>
                <table>
                    <tbody>
                        <tr>
                            <td> 이름 </td>
                            <td className='fill'> 
                                <input onChange={(e) => setName(e.target.value)} />
                            </td>
                            <td> </td>
                        </tr>
                        <tr>
                            <td> 성별 </td>
                            <td className='fill'> 
                                <select onChange={(event) => {
                                    let i = event.target.selectedIndex;
                                    if (i > 0) {
                                        setSex(sexList[i-1]);
                                    }
                                }}> 
                                    { ['골라주세요.'].concat(sexList).map((value) => <option value={value} key={value}>{value}</option>) } 
                                </select> 
                            </td>
                            <td> </td>
                        </tr>
                        <tr>
                            <td> 키 </td>
                            <td className='fill'> <input type='number' onChange={(e) => setHeight(e.target.value)} /> </td>
                            <td> cm </td>
                        </tr>
                        <tr>
                            <td> 체중 </td>
                            <td className='fill'> <input type='number' onChange={(e) => setWeight(e.target.value)} /> </td>
                            <td> kg </td>
                        </tr>
                    </tbody>
                </table>
                <button onClick={submit}>가입</button>
                <div> { message } </div>
            </div>
            <Footer/>
        </>
    );
}

export default Signup;
