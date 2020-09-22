import React, { useEffect } from "react";

import Header from "components/Header";
import ExerciseScreen from "components/ExerciseScreen";
import Footer from "components/Footer";
import usePromise from "utility/usePromise";
import Loading from "pages/Loading";
import { ContentData, PoseData, PlayRecord, CourseContent } from "utility/types";
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

interface MatchParams {
    id: string;
};

interface CourseProps {
    match: match<MatchParams>;
};

function Content({match} : CourseProps) {
    let contentType = React.useMemo<'course' | 'exercise'>(() => match.url.includes('course') ? 'course' : 'exercise', []);
    let id = React.useMemo<number>(() => Number.parseInt(match.params.id), []);
    let [userStreamLoading, userStream, userStreamError] = usePromise(loadStream);
    let [userLoading, setUserLoading] = React.useState<boolean>(true);
    let [guideLoading, setGuideLoading] = React.useState<boolean>(true);
    let [redirectToResult, setRedirectToResult] = React.useState<boolean>(false);
    let userVideo = React.useMemo<HTMLVideoElement>(() => document.createElement('video'), []);
    let guideVideo = React.useMemo<HTMLVideoElement>(() => document.createElement('video'), []);
    let [guidePose, setGuidePose] = React.useState<PoseData>();

    let [contents, setContents] = React.useState<CourseContent[]>();
    let [courseDataLoading, courseData] = usePromise(async () => {
        if (contentType == 'course') {
            const data = await getCourse(id);
            store.dispatch(setContent(data));
            return data;
        } else {
            const data = await getExercise(id);
            store.dispatch(setContent(data));
            return {
                type: 'course',
                name: data.name,
                innerData: JSON.stringify([{
                    phase: "exercise",
                    id: id,
                    repeat: 3,
                }]),
            } as ContentData;
        }
    });
    let [progress, setProgress] = React.useState<number>();

    let [currentExercise, setCurrentExercise] = React.useState<ContentData>();
    let [phase, setPhase] = React.useState<string>('');
    let [message, setMessage] = React.useState<string>('');
    let [repeat, setRepeat] = React.useState<number>(100);

    let [playRecord, setPlayRecord] = React.useState<PlayRecord>({
        playTime: 0, calorie: 0, score: 0,
    });

    useEffect(() => {
        userVideo.height = guideVideo.height = videoHeight;
        userVideo.width = guideVideo.width = videoWidth;
        userVideo.crossOrigin = guideVideo.crossOrigin = 'anonymous';
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

    useEffect(() => {
        if (courseData) {
            setContents(JSON.parse(courseData.innerData));
            setProgress(0);
        }
    }, [courseData]);

    // 새로운 운동이 로딩되었을 때
    useEffect(() => {
        if (currentExercise) {
            guideVideo.src = currentExercise.videoUrl;
            setGuidePose(JSON.parse(currentExercise.innerData));

            guideVideo.load();

            new Promise((resolve) => {
                guideVideo.onloadeddata = resolve;
            }).then(() => {
                setGuideLoading(false);
            });
        }
    }, [currentExercise]);

    // 다음 컨텐츠를 로드해야 할 때
    useEffect(() => {
        if (!contents) return;
        if (progress == contents.length) {
            finish();
        } else {
            load();
        }
    }, [progress]);

    const finish = async () => {
        const loggedIn = store.getState().user.loggedIn;
        if (loggedIn && contentType == 'exercise') 
            await postResult(id, playRecord.score, playRecord.playTime, playRecord.calorie);
        store.dispatch(setResult(playRecord));
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
            playTime: playRecord.playTime + nowRecord.playTime,
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
                  exerciseId: 0,
                  score: playRecord.score,
                  time: playRecord.playTime,
                  calorie: playRecord.calorie,
                },
              }}
            />
        );
    }
    if (userLoading || guideLoading || courseDataLoading) return <Loading/>;
    return (
        <div>
          <Header />
          <Title title={courseData.name} subtitle={message} />
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

export default Content;
