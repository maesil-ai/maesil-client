import apiAddress from '../secret';

// @ts-ignore
import axios from 'axios';
import React from 'react';
import Screen from '../components/Screen';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Redirect } from 'react-router-dom';

interface ExerciseProps {
    match: any,
    history?: any,
};

interface ExerciseState {
    isLoading: boolean,
    isFinished: boolean,
    redirectToResult: boolean,
    id: number,
    url?: string,
    score: number,
    time: number,
    calorie: number,
};

function timeToString(time : number) {
    let sec0 = time % 10;
    time = (time - sec0) / 10;
    let sec1 = time % 6;
    time = (time - sec1) / 6;
    let min0 = time % 10;
    time = (time - min0) / 10;
    let min1 = time % 6;
    time = (time - min1) / 6;
    let hr0 = time % 10;
    time = (time - hr0) / 10;
    let hr1 = time % 10;
    
    return `${hr1}${hr0}:${min1}${min0}:${sec1}${sec0}`
}

class Exercise extends React.Component<ExerciseProps, ExerciseState> {
    guideVideo = React.createRef<HTMLVideoElement>();
    userVideo = React.createRef<HTMLVideoElement>();
    videoWidth = 800;
    videoHeight = 600;

    constructor(props : ExerciseProps) {
        super(props);

        this.state = {
            isLoading: true,
            isFinished: false,
            redirectToResult: false,
            id: props.match.params.id,
            score: 10.21,
            time: 63,
            calorie: 731,
        };
    }

    loadVideo = async (id : number) => {
        let response = await axios.get(apiAddress + '/exercises/' + id);
        return response.data.result.video_url;
    }

    loadStream = async () => {
        return await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                facingMode: 'user',
                width: this.videoWidth,
                height: this.videoHeight,
            }
        })
    }

    componentDidMount = () => {
        let guideSource = this.loadVideo(this.state.id);
        let userStream = this.loadStream();

        Promise.all([guideSource, userStream]).then(([guideSource, userStream]) => {
            let guideVideo = this.guideVideo.current!;
            let userVideo = this.userVideo.current!;
            guideVideo.src = guideSource;
            guideVideo.play();
            userVideo.srcObject = userStream;
            userVideo.play();

            new Promise((resolve) => {
                let cnt = 0;
                let incrementCnt = () => {
                    cnt += 1;
                    if (cnt >= 2) resolve();
                }
                guideVideo.onloadeddata = incrementCnt;
                userVideo.onloadeddata = incrementCnt;
            }).then(() => this.setState({
                ...this.state,
                isLoading: false,
            }));
        });
    };

    onExerciseFinish = (data) => {
        axios.post(apiAddress + "/exercises/" + this.state.id + "/history", {
            "score": this.state.score,
            "play_time": timeToString(this.state.time),
            "cal": this.state.calorie,
        }).then((response) => {
            // response.data.code != 200이면?
            console.log(response);
            if (response.data.code === 200) {
                this.setState({
                    ...this.state,
                    redirectToResult: true,
                });
            }
        }).catch((error) => {
            
        });
    }

    render() {
        if (this.state.redirectToResult) {
            return <Redirect push to={{
                pathname: "/result",
                state: {
                    score: this.state.score,
                    time: this.state.time,
                    calorie: this.state.calorie,
                }
            }}/>
        }
        let videos = (
            <div>
                <video
                    height={this.videoHeight}
                    width={this.videoWidth}
                    crossOrigin={"anonymous"}
                    style={{display: "none"}}
                    ref={this.guideVideo}
                />
                <video
                    height={this.videoHeight}
                    width={this.videoWidth}
                    crossOrigin={"anonymous"}
                    style={{display: "none"}}
                    ref={this.userVideo}
                />
            </div>
        );

        if (this.state.isLoading) return (
            <div>
                <Header/>
                { videos }
                운동 불러오는 중...
                <Footer/>
            </div>
        );
        else return (
            <div>
                <Header/>
                { videos }
                <Screen
                    videoWidth = { this.videoWidth }
                    videoHeight = { this.videoHeight }
                    views = {[
                        { // Guide View
                            video: this.guideVideo.current!,
                            scale: 1,
                            offset: [0, 0],
                        },
                        { // User View
                            video: this.userVideo.current!,
                            scale: 0.4,
                            offset: [100, 100],
                        }
                    ]}
                />
                <button onClick={ this.onExerciseFinish }>
                    그냥 결과창 보내기        
                </button>
                <Footer/>
            </div>
        );
    }
};

export default Exercise;