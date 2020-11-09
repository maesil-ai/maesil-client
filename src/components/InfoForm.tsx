import React from 'react';
import { femaleIcon, maleIcon } from 'utility/svg';
import { APIGetUserInfoData } from 'utility/types';

interface InfoFormProps {
  defaultInfo? : APIGetUserInfoData;
  onSubmit : (name: string, sex: string, height: number, weight: number, setMessage: (string) => void) => void;
  buttonMessage : string;
};

function InfoForm({ defaultInfo = null, onSubmit, buttonMessage } : InfoFormProps) {
  let [name, setName] = React.useState<string>(defaultInfo ? defaultInfo.nickname : '');
  let [sex, setSex] = React.useState<string>(defaultInfo ? defaultInfo.gender : '');
  let [height, setHeight] = React.useState<string>(defaultInfo ? defaultInfo.height.toString() : '');
  let [weight, setWeight] = React.useState<string>(defaultInfo ? defaultInfo.weight.toString() : '');
  let [message, setMessage] = React.useState<string>('');

  const sexList = ['남성', '여성'];

  const isParsable = (str: string) => {
    try {
      Number.parseInt(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  const validateData = () => {
    if (name.length < 1) {
      return '이름을 적어 주세요.';
    } else if (name.length > 20) {
      return '이름은 최대 20글자로 해 주세요.';
    } else if (!sexList.find((value) => value == sex)) {
      return '성별을 골라 주세요.';
    } else if (!isParsable(height) || height.length < 2 || height.length > 3) {
      return '키는 10cm에서 999cm 사이로 적어 주세요.';
    } else if (!isParsable(weight) || weight.length < 2 || weight.length > 3) {
      return '체중은 10kg에서 999kg 사이로 적어 주세요.';
    } else {
      return true;
    }
  };

  const submit = () => {
    let valid = validateData();
    if (valid != true) setMessage(valid);
    else {
      onSubmit(name, sex, Number.parseInt(height), Number.parseInt(weight), setMessage);
    }
  };

  return (
    <>
      <table style={{width: 'calc(100% - 58px)'}}>
        <tbody>
          <tr>
            <td> 이름 </td>
            <td className="fill inputbox">
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </td>
          </tr>
          <tr>
            <td> 성별 </td>
            <td className="fill">
              <button className={'select' + ((sex == '남성') ? ' selected blue' : '')} onClick={() => setSex('남성')}>
                { maleIcon }
              </button>
              <button className={'select' + ((sex == '여성') ? ' selected red' : '')} onClick={() => setSex('여성')} style={{transform: 'translateY(-2px)'}}>
                { femaleIcon }
              </button>
            </td>
          </tr>
          <tr>
            <td> 키 </td>
            <td className="fill inputbox">
              <input
                type="number"
                className='withunit'
                value={height.toString()}
                onChange={(e) => setHeight(e.target.value)}
              />
              <span className='unit'> cm </span>
            </td>
          </tr>
          <tr>
            <td> 체중 </td>
            <td className="fill inputbox">
              <input
                type="number"
                className='withunit'
                value={weight.toString()}
                onChange={(e) => setWeight(e.target.value)}
              />
              <span className='unit'> kg </span>
            </td>
          </tr>
        </tbody>
      </table>
      <button className='submit' onClick={submit}> {buttonMessage} </button>
      <div> {message} </div>
    </>
  );
}

export default InfoForm;
