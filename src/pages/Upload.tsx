import { postExercise } from '../utility/api';

import React from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Title from '../components/Title';

import { useDropzone } from 'react-dropzone'


interface UploadProps {
    
};

export function Upload({ } : UploadProps) {
  const onDrop = React.useCallback(acceptedFiles => {
    console.log(acceptedFiles);
    postExercise({
      exercise: acceptedFiles[0],
      title: "아 배고파",
      play_time: "00:01:03",
    })
  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <>
      <Header/>
      <Title title="운동 업로드"/>
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>여기로 파일을 드래그해 주세요.</p> :
            <p>운동 영상을 드래그하거나, 상자를 눌러서 운동 영상을 올려 주세요.</p>
        }
      </div>
      <Footer/>
    </>
  )
}

export default Upload;
