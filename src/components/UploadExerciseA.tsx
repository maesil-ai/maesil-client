import React from 'react';
import { useDropzone } from 'react-dropzone';
import { validA } from 'utility/validation';

interface UploadExerciseAProps {
  onFinish: (ok: String, videoFile: Blob) => void;
}

export function UploadExerciseA({ onFinish }: UploadExerciseAProps) {
  const onDrop = React.useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    onFinish(validA(file), file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps({ className: 'zone' })}>
      <div style={{paddingBottom: '110px'}} />
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>
          <div>
            <img src='https://maesil-storage.s3.ap-northeast-2.amazonaws.com/upload-file.png' height={150} />
          </div>
          <div>
            <br/>
            여기로 파일을 드래그해 주세요.
          </div>
        </p>
      ) : (
        <p>
          <div>
            <img src='https://maesil-storage.s3.ap-northeast-2.amazonaws.com/upload-file.png' height={150} />
          </div>
          <div>
          <br/>
            파일을 여기로 드래그하거나, 상자를 눌러서 운동 영상을 올려 주세요.
          </div>
        </p>
      )}
      <div style={{paddingBottom: '110px'}} />
    </div>
  );
}

export default UploadExerciseA;
