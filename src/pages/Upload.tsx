import { } from '../utility/api';

import React from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Title from '../components/Title';
import Loading from '../components/Loading';

interface UploadProps {
    
};

interface UploadState {
    
};


class Upload extends React.Component<UploadProps, UploadState> {

  render() {
    return (
        <>
            <Header/>
            <Title title="운동 업로드"/>
            <Footer/>
        </>
    );
  }
};

export default Upload;
