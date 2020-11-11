import React, { useEffect } from "react";

import Header from "components/Header";
import ExerciseScreen from "components/ExerciseScreen";
import Footer from "components/Footer";
import usePromise from "utility/usePromise";
import Loading from "pages/Loading";
import { ContentData, PoseData2D, PlayRecord, CourseContent } from "utility/types";
import { getExercise, postResult, getCourse, getPoseData } from "utility/api";
import { match, Redirect, RouteComponentProps } from "react-router-dom";
import { setResult, setContent, setStream } from 'actions';
import store from 'store';
import ContentDetail from "components/ContentDetail";
import { mainColor1, warningIcon } from "utility/svg";
import Title from "components/Title";

const videoWidth = 800;
const videoHeight = 600;

const loadStream = async () => {
    let stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            facingMode: 'user',
            width: videoWidth,
            height: videoHeight,
        },
    });

    store.dispatch(setStream(stream));
    return stream;
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
    let [userStreamLoading, userStream, userStreamError] = usePromise(loadStream, [], 'ignore');
    let [userLoading, setUserLoading] = React.useState<boolean>(true);
    let [guideLoading, setGuideLoading] = React.useState<boolean>(true);
    let [redirectToResult, setRedirectToResult] = React.useState<boolean>(false);
    let [userVideo] = React.useState<HTMLVideoElement>(document.createElement('video'));
    let [guideVideo] = React.useState<HTMLVideoElement>(document.createElement('video'));
    let [guidePose, setGuidePose] = React.useState<PoseData2D>();
    let video3dRef = React.useRef();

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
                innerData: JSON.stringify([
                {
                    phase: 'break',
                    repeat: 10,
                    message: '카메라 앞에 서 주세요.',
                },
                {
                    phase: "exercise",
                    id: id,
                    repeat: data.playTime >= 30 ? 1 : 10,
                    waitBefore: 90,
                }]),
            } as ContentData;
        }
    });
    let [progress, setProgress] = React.useState<number>();

    let [currentExercise, setCurrentExercise] = React.useState<ContentData>();
    let [phase, setPhase] = React.useState<string>('');
    let [message, setMessage] = React.useState<string>('');
    let [waitBefore, setWaitBefore] = React.useState<number>(0);
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
            let stream = store.getState().content.stream;
            stream.getTracks().forEach((track) => {
                track.stop();
            });
            store.dispatch(setStream(null));
            userVideo.pause();
            userVideo.remove();
            guideVideo.pause();
            guideVideo.remove();
        }
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
            const f = async () => {
                guideVideo.src = currentExercise.videoUrl;
                if (!currentExercise.innerData) {
                    currentExercise.innerData = JSON.stringify(await getPoseData(currentExercise.id));
                }
                try {
                    setGuidePose(JSON.parse(currentExercise.innerData));
                } catch (error) { }

                guideVideo.load();

                new Promise((resolve) => {
                    guideVideo.onloadeddata = resolve;
                }).then(() => {
                    setGuideLoading(false);
                });
            };
            f();
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
        if (userStream) {
            userStream.getTracks().forEach((track) => {
                track.stop();
            });
        }
        store.dispatch(setResult(playRecord));

        
        setRedirectToResult(true);
    };


    const load = async () => {
        const content = contents[progress];

        setPhase(content.phase);
        setMessage(content.message);
        setRepeat(content.repeat);
        if (content.waitBefore) setWaitBefore(content.waitBefore);
        else setWaitBefore(0);
        if (content.phase == 'exercise') {
            let exercise = await getExercise(content.id);
            setCurrentExercise(exercise);
        } else {
            setGuideLoading(false);
        }
    }

    const handleExerciseFinish = (nowRecord: PlayRecord) => {
        if (store.getState().user.loggedIn) postResult(id, nowRecord.score, nowRecord.playTime, nowRecord.calorie);
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
    if (userStreamError) {
        return (
            <>
                <Header real={false}/>
                <div className='zone'>
                    { warningIcon }
                    <div style={{paddingBottom: '16px'}} />
                    <h1 className='grey'> 앗! 카메라가 필요합니다! </h1>
                    <div style={{paddingBottom: '16px'}} />
                    <div> 매실은 여러분의 운동 영상을 분석해서 운동 자세를 피드백하는 서비스입니다. </div>
                    <div> 그래서 만약 카메라가 없거나 카메라 사용설정을 허용하지 않으셨다면 매실 서비스를 사용할 수 없습니다. </div>
                    <div> 주소창 왼쪽에 표시되는 카메라 사용 설정을 활성화해 주세요. </div>
                </div>
                <Footer/>
            </>
        );
    }
    else if (userLoading || guideLoading || userStreamLoading || courseDataLoading) return <Loading/>;
    else return (
        <>
            <Header />
            { phase == 'exercise' && 
            <>
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
                        scale: 0.35,
                        offset: [0.65*videoWidth, 0.65*videoHeight-10],
                    },
                    ]}
                    waitBefore={waitBefore}
                    repeat={repeat}
                    guidePose={guidePose}
                />
                { /* <video src={`https://maesil-storage.s3.ap-northeast-2.amazonaws.com/pose/${id}/${id}_vibe_result.mp4`} autoPlay loop ref={video3dRef} style={{
                    position: 'fixed',
                    right: '30px',
                    bottom: '30px',
                    width: '300px'
                }} /> */ }
            </>
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
                waitBefore={waitBefore}
                time={repeat}
            />
            }
            { message && (
                <div style={{width: '800px', margin: '5px auto', border: `2px ${mainColor1} solid`, borderRadius: '10px'}}> 
                    <div style={{marginBottom: '-30px'}} />
                    <Title title={message} size='small'/> 
                </div>
            )}
            <div style={{width: videoWidth}}>
                <ContentDetail data={ store.getState().content.content } />
            </div>
            <Footer />
        </>
      );
}

export default Content;
