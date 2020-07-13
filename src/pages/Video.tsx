import api_address from '../secret';
import axios from 'axios';
import React from 'react';
import Screen from '../components/Screen';

interface VideoProps {
    match: any,
};

interface VideoState {
    isLoading: boolean,
    id: number,
    url?: string,
};

class Video extends React.Component<VideoProps, VideoState> {
    guideVideo = React.createRef<HTMLVideoElement>();
    userVideo = React.createRef<HTMLVideoElement>();
    videoWidth = 800;
    videoHeight = 600;

    constructor(props : VideoProps) {
        super(props);

        this.state = {
            isLoading: true,
            id: props.match.params.id,
        }
    }

    loadVideo = async (id : number) => {
        let response = await axios({
            url: api_address + '/' + id,
            method: 'GET',
        });
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
                guideVideo.onloadeddata = () => {
                    cnt += 1;
                    if (cnt >= 2) resolve();
                };
                userVideo.onloadeddata = () => {
                    cnt += 1;
                    if (cnt >= 2) resolve();
                }
            }).then(() => this.setState({
                ...this.state,
                isLoading: false,
            }));
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
                { videos }
                Loading......
            </div>
        );
        else return (
            <div>
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
            </div>
        );
    }
};

export default Video;