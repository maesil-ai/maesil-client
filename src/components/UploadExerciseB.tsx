import React from 'react';

import { postExercise } from 'utility/api';
import { validateVideoLength } from 'utility/validation';
import { recordFps, extractPoseFromVideo } from 'utility/processVideo';
import { PoseData2D, Pose2D } from 'utility/types';

interface UploadExerciseBProps {
  video: File;
}

export function UploadExerciseB({ video }: UploadExerciseBProps) {
  let [title, setTitle] = React.useState<string>('');
  let [description, setDescription] = React.useState<string>('');
  let [message, setMessage] = React.useState<string>('영상 처리 중...');
  let [poses, setPoses] = React.useState<Pose2D[]>([]);
  let [thumbnail, setThumbnail] = React.useState<File>();
  let [gifThumbnail, setGifThumbnail] = React.useState<File>();
  let videoRef = React.useRef<HTMLVideoElement>();

  let videoUrl = React.useMemo<string>(() => URL.createObjectURL(video), []);

  const handleExtractProgress = (ratio: number) => {
    setMessage(`영상 ${Math.round(ratio * 100)}% 처리 중...`);
  };

  const handleExtractFail = (message: string) => {
    setMessage(message);
  };

  React.useEffect(() => {
    extractPoseFromVideo(videoUrl, handleExtractProgress, handleExtractFail)
      .then((poses) => {
        setMessage('');
        setPoses(poses);
      })
      .catch(() => {});
  }, []);

  const guideVideo = React.useMemo(() => (
    <video
      src={videoUrl}
      loop
      autoPlay
      controls
      className="previewVideo"
      ref={videoRef}
    />
  ), [videoUrl]);

  const upload = async () => {
    setMessage('올리는 중...');

    if (!(1 <= videoRef.current.duration || videoRef.current.duration <= 15)) {
      setMessage('영상의 길이는 1초에서 15초 사이여야 합니다.');
      return;
    }

    const success = await postExercise({
      exercise: video,
      title: title,
      description: description,
      play_time: videoRef.current.duration,
      thumbnail: thumbnail,
      gif_thumbnail: gifThumbnail,
      reward: 103,
      tag_id: 2,
      level: 4,
      skeleton: JSON.stringify({
        fps: recordFps,
        poses: poses,
      } as PoseData2D),
    });

    if (success) {
      setMessage('업로드 성공!');
    } else {
      setMessage('업로드 실패...');
    }
  };

  return (
    <>
        <div className="zone">
        { guideVideo }
        <table>
          <tbody>
            <tr>
              <td> 제목 </td>
              <td className="fill inputbox">
                <input
                  className="inputTitle"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td > 설명 </td>
              <td className="fill inputbox" style={{height: '96px'}}>
                <textarea
                  className="inputDescription"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value) }
                />
              </td>
            </tr>
            <tr>
              <td> 썸네일 이미지 </td>
              <td className="fill inputbox">
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setThumbnail(e.target.files[0])}
                />
              </td>
            </tr>
            <tr>
              <td> 움직이는 썸네일 이미지 </td>
              <td className="fill inputbox">
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setGifThumbnail(e.target.files[0])}
                />
              </td>
            </tr>
          </tbody>
        </table>
        </div>
        <div className='zone invisible'>
          { message ? <div> { message } </div> : <> </> }
          { poses.length > 0 && <button onClick={upload} className='submit'> 올리기! </button> }
        </div>
    </>
  );
}

export default UploadExerciseB;
