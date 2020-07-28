import React from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Title from '../components/Title';
import UploadA from '../components/UploadA';
import UploadB from '../components/UploadB';


interface UploadProps {
    
};

export function Upload({ } : UploadProps) {
  let [phase, setPhase] = React.useState(1);
  let [video, setVideo] = React.useState(null);

  let handleAFinish = (ok : String, video : Blob) => {
    if (ok == "ok") {
      setVideo(video);
      setPhase(2);
    } else {
      alert(ok);
    }
  }

  return (
    <>
      <Header/>
      <Title title="운동 업로드"/>
      { phase == 1 && <UploadA onFinish={handleAFinish}/> }
      { phase == 2 && <UploadB video={video}/> }  
      <Footer/>
    </>
  )
}

export default Upload;
