import React from 'react';
import ReactLoading from 'react-loading';

import Title from 'components/Title';
import Header from 'components/Header';
import Footer from 'components/Footer';
// import BeatLoader from "react-spinners/BeatLoader";

interface LoadingProps {
  headerReal?: boolean;
  mini?: boolean;
};

function Loading({ headerReal = true, mini = false } : LoadingProps) {
  let rgb1 = [0, 190, 120], rgb2 = [45, 50, 150];
  let [mix, setMix] = React.useState(0);

  React.useEffect(() => {
    if (mix >= 0) setTimeout(() => {
      if (mix == 98) setMix(99);
      else if (mix % 2 == 0) setMix(mix + 2);
      else if (mix == 1) setMix(0);
      else setMix(mix - 2);
    }, 30);
    return () => mix = -1;
  })

  let color = (mix : number) => {
    let x = rgb1[0] + (rgb2[0]-rgb1[0])*mix/100;
    let y = rgb1[1] + (rgb2[1]-rgb1[1])*mix/100;
    let z = rgb1[2] + (rgb2[2]-rgb1[2])*mix/100;
    return `rgb(${x}, ${y}, ${z})`;
  };

  if (mini) return (
    <ReactLoading type='bars' color={color(mix)} height='80px' width='80px' />
  );
  return (
    <div style={{position: 'absolute', left: 'calc(50% - 50px)', top: 'calc(50% - 50px)'}}>
      <ReactLoading type='bars' color={color(mix)} height='100px' width='100px' />
      <div style={{textAlign: 'center', fontSize: '20px', fontWeight: 300, color: 'grey', height: '20px'}}>
        불러오는 중..
      </div>
    </div>
  );
}

export default Loading;
