import React, { useEffect } from "react";

import Header from "components/Header";
import ExerciseScreen from "components/ExerciseScreen";
import Footer from "components/Footer";
import usePromise from "utility/usePromise";
import Loading from "components/Loading";
import { ExerciseData, PoseData, PlayRecord, CourseContent } from "utility/types";
import { getExercise, postResult } from "utility/api";
import { Redirect } from "react-router-dom";

const videoWidth = 800;
const videoHeight = 600;

const amuId = 11;

const defaultContents : CourseContent[] = [
    {
        phase: 'exercise',
        id: amuId,
        repeat: 3,
        message: "첫번째 운동을 하구요...",
    },
    {
        phase: 'break',
        id: null,
        repeat: 5,
        message: "5초간 쉽니다...",
    },
    {
        phase: 'exercise',
        id: amuId,
        repeat: 3,
        message: "다시 운동을 합니다...",
    }
];

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

interface CourseProps {

};

function Course({} : CourseProps) {
    let [userStreamLoading, userStream, userStreamError] = usePromise(loadStream);
    let [userLoading, setUserLoading] = React.useState<boolean>(true);
    let [guideLoading, setGuideLoading] = React.useState<boolean>(true);
    let [redirectToResult, setRedirectToResult] = React.useState<boolean>(false);

    let [userVideo, setUserVideo] = React.useState<HTMLVideoElement>(document.createElement('video'));
    let [guideVideo, setGuideVideo] = React.useState<HTMLVideoElement>(document.createElement('video'));
    let [guidePose, setGuidePose] = React.useState<PoseData>();

    let [contents, setContents] = React.useState<CourseContent[]>(defaultContents);
    let [progress, setProgress] = React.useState<number>(0);

    let [currentExercise, setCurrentExercise] = React.useState<ExerciseData>();
    let [phase, setPhase] = React.useState<string>('');
    let [message, setMessage] = React.useState<string>('');
    let [repeat, setRepeat] = React.useState<number>(100);

    let [playRecord, setPlayRecord] = React.useState<PlayRecord>({
        time: 0, calorie: 0, score: 0,
    });

    useEffect(() => {
        userVideo.height = guideVideo.height = videoHeight;
        userVideo.width = guideVideo.width = videoWidth;
        userVideo.crossOrigin = guideVideo.crossOrigin = 'anonymous';
  
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

    // 새로운 운동이 로딩되었을 때
    useEffect(() => {
        if (currentExercise) {
            guideVideo.src = currentExercise.videoUrl;
            setGuidePose(JSON.parse(currentExercise.skeleton));

            new Promise((resolve) => {
                guideVideo.onloadeddata = resolve;
            }).then(() => {
                setGuideLoading(false);
            });
        }
    }, [currentExercise]);

    // 다음 컨텐츠를 로드해야 할 때
    useEffect(() => {
        if (progress == contents.length) {
            finish();
        } else {
            load();
        }
    }, [progress]);

    const finish = async () => {
        await postResult(amuId, playRecord.score, playRecord.time, playRecord.calorie);
        setRedirectToResult(true);
    };


    const load = async () => {
        const content = contents[progress];

        setPhase(content.phase);
        setMessage(content.message);
        setRepeat(content.repeat);
        if (content.phase == 'exercise') {
            let exercise = await getExercise(content.id);
            setCurrentExercise(exercise);
        } else {
            
            setGuideLoading(false);
        }        
    }

    const handleExerciseFinish = (nowRecord: PlayRecord) => {
        setPlayRecord({
            time: playRecord.time + nowRecord.time,
            calorie: playRecord.calorie + nowRecord.calorie,
            score: playRecord.score + nowRecord.score / contents.length,
        });
        setGuideLoading(true);
        setProgress(progress + 1);
    }



    if (redirectToResult) {
        return (
            <Redirect
              push
              to={{
                pathname: '/result',
                state: {
                  exerciseId: amuId,
                  score: playRecord.score,
                  time: playRecord.time,
                  calorie: playRecord.calorie,
                },
              }}
            />
        );
    }
    if (userLoading || guideLoading) {
        return (
            <>
                <Header />
                <Loading />
                <Footer />
            </>
        );
    }
    return (
        <div>
          <Header />
          <div className='zone'>
              {message}
          </div>
            { phase == 'exercise' && 
            <ExerciseScreen
                onExerciseFinish={handleExerciseFinish}
                videoWidth={videoWidth}
                videoHeight={videoHeight}
                phase='exercise'
                views={[
                {
                    video: guideVideo,
                    scale: 1,
                    offset: [0, 0],
                },
                {
                    video: userVideo,
                    scale: 0.3,
                    offset: [0.7*videoWidth-20, 0.7*videoHeight-20],
                },
                ]}
                repeat={repeat}
                guidePose={guidePose}
            />
            }
            { phase == 'break' && 
            <ExerciseScreen 
                onExerciseFinish={handleExerciseFinish}
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
                time={repeat}
            />
            }
          <Footer />
        </div>
      );
}

export default Course;
