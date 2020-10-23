import React from 'react';
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

  const sexList = ['여성', '남성', '기타'].sort(() => Math.random() - 0.5);

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
            <td className="fill inputbox">
              <select
                value={sex ? sex : 0}
                onChange={(event) => {
                  let i = event.target.selectedIndex;
                  if (i > 0) {
                    setSex(sexList[i - 1]);
                  }
                }}
              >
                {['골라주세요.'].concat(sexList).map((value) => (
                  <option value={value} key={value}>
                    {value}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <td> 키 </td>
            <td className="fill inputbox">
              <input
                type="number"
                value={height.toString()}
                onChange={(e) => setHeight(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td> 체중 </td>
            <td className="fill inputbox">
              <input
                type="number"
                value={weight.toString()}
                onChange={(e) => setWeight(e.target.value)}
              />
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
