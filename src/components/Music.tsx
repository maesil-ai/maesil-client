import React from 'react';


function Music() {
    const musicUrl = 'https://maesil-storage.s3.ap-northeast-2.amazonaws.com/musics/Diamond+Eyes+-+23+%5BNCS+Release%5D.mp3';
    const musicRef = React.useRef<HTMLAudioElement>();


    return (
        <audio src={ musicUrl } ref={musicRef} loop autoPlay style={{visibility: 'hidden'}} />
    );
}

export default Music;
