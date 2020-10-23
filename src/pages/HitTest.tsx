import React, { useEffect } from "react";

import Header from "components/Header";
import ExerciseScreen from "components/ExerciseScreen";
import Footer from "components/Footer";
import usePromise from "utility/usePromise";
import Loading from "pages/Loading";
import { ContentData, PoseData2D, PlayRecord, CourseContent } from "utility/types";
import { getExercise, postResult, getCourse } from "utility/api";
import { match, Redirect, RouteComponentProps } from "react-router-dom";
import { setResult, setContent } from 'actions';
import store from 'store';
import Title from "components/Title";

const videoWidth = 800;
const videoHeight = 600;

const loadStream = async () => {
    return await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            facingMode: 'user',
            width: videoWidth,
            height: videoHeight,
        },
    });
};

function HitTest() {
    let [userStreamLoading, userStream, userStreamError] = usePromise(loadStream);
    let [userLoading, setUserLoading] = React.useState<boolean>(true);
    let userVideo = React.useMemo<HTMLVideoElement>(() => document.createElement('video'), []);

    let [playRecord, setPlayRecord] = React.useState<PlayRecord>({
        playTime: 0, calorie: 0, score: 0,
    });

    useEffect(() => {
        userVideo.height = videoHeight;
        userVideo.width = videoWidth;
        userVideo.crossOrigin = 'anonymous';
        userVideo.load();

        new Promise((resolve) => {
            userVideo.onloadeddata = resolve;
        }).then(() => {
            setUserLoading(false);
        });

        return () => {
            if (userStream) {
                userStream.getTracks().forEach((track) => {
                    track.stop();
                });
            }
        };
    }, []);

    // 내 카메라 스트림이 로딩되었을 때
    useEffect(() => {
        userVideo.srcObject = userStream;
    }, [userStream]);

    if (userLoading) return <Loading/>;
    return (
        <>
          <Header />
          <Title title='타격 테스트' subtitle='배고픕니다.' />
            <ExerciseScreen 
                videoWidth={videoWidth}
                videoHeight={videoHeight}
                phase='break'
                views={[
                    {
                        video: userVideo,
                        scale: 1,
                        offset: [0, 0],
                    },
                ]}
                time={3600}
                showHits={true}
            />
          <Footer />
        </>
      );
}

export default HitTest;
