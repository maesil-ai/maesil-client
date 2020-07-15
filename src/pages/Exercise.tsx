import api_address from '../secret';

// @ts-ignore
import axios from 'axios';
import React from 'react';
import Screen from '../components/Screen';
// import { Link } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';

interface ExerciseProps {
    match: any,
    history?: any,
};

interface ExerciseState {
    isLoading: boolean,
    id: number,
    url?: string,
};

class Exercise extends React.Component<ExerciseProps, ExerciseState> {
    guideVideo = React.createRef<HTMLVideoElement>();
    userVideo = React.createRef<HTMLVideoElement>();
    videoWidth = 800;
    videoHeight = 600;

    constructor(props : ExerciseProps) {
        super(props);

        this.state = {
            isLoading: true,
            id: props.match.params.id,
        }
    }

    loadVideo = async (id : number) => {
        let response = await axios.get(api_address + '/exercises/' + id);
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
    }

    onExerciseFinish = (data) => {
        axios.post(api_address + "/exercises/" + this.state.id + "/history", {
            "score": -1,
            "play_time": "00:01:03",
            "cal": -1,
        }).then((response) => {
            this.props.history.push('/result');
        }).catch((error) => {
            
        });
    }

    render() {
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