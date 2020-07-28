import { postExercise } from '../utility/api';

import React from 'react';

interface UploadBProps {
    video : Blob,
};

export function UploadB({ video } : UploadBProps) {
  let [title, setTitle] = React.useState("아 배고프다.");
  let [description, setDescription] = React.useState("머 그렇게 만들어진 영상입니다 긴 말 안하겠습니다 이 영상은 개 쩌는 영상입니다 운동효과 완전 개굿입니다");
  let [message, setMessage] = React.useState("");
  let videoUrl = URL.createObjectURL(video);

  const upload = async () => {
    const defaultUrl = 'https://maesil-storage.s3.ap-northeast-2.amazonaws.com/images/boyunImage.jpg';
    const defaultThumbnail = await fetch(defaultUrl, {mode: "no-cors"}).then(r => r.blob());
    console.log(defaultThumbnail);
    setMessage('업로드 중...');
    console.log({
      exercise: video,
      title: title,
      description: description,
      play_time: 63,
      thumbnail: defaultThumbnail,
      reward: 103,
      tag_id: 2,
      level: 4,
    });
    
    const success = await postExercise({
      exercise: video,
      title: title,
      description: description,
      play_time: 63,
      thumbnail: defaultThumbnail,
      reward: 103,
      tag_id: 2,
      level: 4,
    });

    if (success) {
      setMessage('업로드 성공!');
    } else {
      setMessage('업로드 실패...');
    }
  }

  return (
      <div style={{display: 'flex', justifyContent: 'center', width: 1200}}>
        <video src={videoUrl} loop autoPlay controls className='previewVideo'/>
        <div className='configzone'>
          <div>
            제목  
            <input className='inputTitle' value={title} onChange={(e) => { setTitle(e.target.value); }}/> 
          </div>
          <div>
            설명  
            <input className='inputDescription' value={description} onChange={(e) => { setDescription(e.target.value); }}/>
          </div>
          <button onClick={upload}> 올리기! </button>
          <div> { message } </div>
        </div>
      </div>
  )
}

export default UploadB;
