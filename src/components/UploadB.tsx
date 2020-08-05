import React from 'react';

import { postExercise } from 'utility/api';
import { validateVideoLength } from 'utility/validation';
import { recordFps, extractPoseFromVideo } from 'utility/processVideo';
import { PoseData, Pose } from 'utility/types';

interface UploadBProps {
    video : File,
};

export function UploadB({ video } : UploadBProps) {
  let [title, setTitle] = React.useState<string>("그대 기억이 지난 사랑이 내 안을 파고드는 가시가 되어");
  let [description, setDescription] = React.useState<string>("머 그렇게 만들어진 영상입니다 긴 말 안하겠습니다 이 영상은 개 쩌는 영상입니다 운동효과 완전 개굿입니다");
  let [message, setMessage] = React.useState<string>("영상 처리 중...");
  let [poses, setPoses] = React.useState<Pose[]>([]);
  let videoRef = React.useRef<HTMLVideoElement>();

  let videoUrl = URL.createObjectURL(video);

  const handleExtractProgress = (ratio : number) => {
    setMessage(`영상 ${Math.round(ratio*100)}% 처리 중...`)
  }

  React.useEffect(() => {
    extractPoseFromVideo(videoUrl, handleExtractProgress).then((poses) => {
      setMessage("");
      setPoses(poses);
    }).catch((error) => {
      setMessage("전신이 나오는 영상을 올려주세요.");
      console.log(error);
    });
  }, []);

  const upload = async () => {
    const defaultThumbnailUrl = 'https://maesil-storage.s3.ap-northeast-2.amazonaws.com/images/boyunImage.jpg';
    const defaultThumbnail = await fetch(defaultThumbnailUrl, {mode: "no-cors"}).then(r => r.blob());
    setMessage('올리는 중...');

    if (!await validateVideoLength(videoRef.current)) {
      setMessage('영상의 길이는 1초에서 15초 사이여야 합니다.');
      return;
    }

    const success = await postExercise({
      exercise: video,
      title: title,
      description: description,
      play_time: videoRef.current.duration,
      thumbnail: defaultThumbnail,
      reward: 103,
      tag_id: 2,
      level: 4,
      skeleton: JSON.stringify({
        fps: recordFps,
        poses: poses,
      } as PoseData),
    });

    if (success) {
      setMessage('업로드 성공!');
    } else {
      setMessage('업로드 실패...');
    }
  }

  return (
    <>
      <div style={{display: 'flex', justifyContent: 'center', width: 1200}}>
        <video src={videoUrl} loop autoPlay controls className='previewVideo' ref={videoRef}/>
        <div className='configzone'>
          <div>
            제목  
            <input className='inputTitle' value={title} onChange={(e) => { setTitle(e.target.value); }}/> 
          </div>
          <div>
            설명  
            <input className='inputDescription' value={description} onChange={(e) => { setDescription(e.target.value); }}/>
          </div>
          { message ? message : <button onClick={upload}> 올리기! </button> }
        </div>
      </div>
    </>
  );
}

export default UploadB;
