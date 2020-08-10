import React from 'react';

import { postExercise } from 'utility/api';
import { validateVideoLength } from 'utility/validation';
import { recordFps, extractPoseFromVideo } from 'utility/processVideo';
import { PoseData, Pose } from 'utility/types';

interface UploadBProps {
  video: File;
}

export function UploadB({ video }: UploadBProps) {
  let [title, setTitle] = React.useState<string>(
    '그대 기억이 지난 사랑이 내 안을 파고드는 가시가 되어'
  );
  let [description, setDescription] = React.useState<string>(
    '머 그렇게 만들어진 영상입니다 긴 말 안하겠습니다 이 영상은 개 쩌는 영상입니다 운동효과 완전 개굿입니다'
  );
  let [message, setMessage] = React.useState<string>('영상 처리 중...');
  let [poses, setPoses] = React.useState<Pose[]>([]);
  let [thumbnail, setThumbnail] = React.useState<File>();
  let videoRef = React.useRef<HTMLVideoElement>();

  let [videoUrl, setVideoUrl] = React.useState<string>(URL.createObjectURL(video));

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
    const defaultThumbnailUrl =
      'https://maesil-storage.s3.ap-northeast-2.amazonaws.com/images/boyunImage.jpg';
    const defaultThumbnail = await fetch(defaultThumbnailUrl, {
      mode: 'no-cors',
    }).then((r) => r.blob());
    setMessage('올리는 중...');

    if (!(await validateVideoLength(videoRef.current))) {
      setMessage('영상의 길이는 1초에서 15초 사이여야 합니다.');
      return;
    }

    const success = await postExercise({
      exercise: video,
      title: title,
      description: description,
      play_time: videoRef.current.duration,
      thumbnail: thumbnail ? thumbnail : defaultThumbnail,
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
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', width: 1200 }}>
        { guideVideo }
        <div className="zone">
          <table>
            <tbody>
              <tr>
                <td> 제목 </td>
                <td className="fill">
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
                <td> 설명 </td>
                <td className="fill">
                  <textarea
                    className="inputDescription"
                    rows={5}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td> 썸네일 이미지 </td>
                <td className="fill">
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setThumbnail(e.target.files[0])}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          {message ? message : <button onClick={upload}> 올리기! </button>}
        </div>
      </div>
    </>
  );
}

export default UploadB;
