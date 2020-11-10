import React from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Title from '../components/Title';
import UploadExerciseA from 'components/UploadExerciseA';
import UploadExerciseB from 'components/UploadExerciseB';
import Tabs from 'components/Tabs';

function UploadExercise() {
  let [phase, setPhase] = React.useState(1);
  let [video, setVideo] = React.useState(null);

  let handleAFinish = (ok: String, video: Blob) => {
    if (ok == 'ok') {
      setVideo(video);
      setPhase(2);
    } else {
      alert(ok);
    }
  };

  return (
    <>
      <Header />
      <Tabs data={[{
        name: "운동 업로드",
        link: "/studio/exercise",
        active: true,
      }, {
        name: "운동 코스 제작",
        link: "/studio/course",
        active: false,
      }]} />
      {phase == 1 && <UploadExerciseA onFinish={handleAFinish} />}
      {phase == 2 && <UploadExerciseB video={video} />}
      <Footer />
    </>
  );
}

export default UploadExercise;
