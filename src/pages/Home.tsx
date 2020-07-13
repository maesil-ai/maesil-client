import api_address from '../secret';
import axios from 'axios';
import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

interface HomeProps {

};

interface video {
    id: number,
    url: string,
};

interface HomeState {
    videos: video[],
    select: number,
};

class Home extends React.Component<HomeProps, HomeState> {
    constructor(props : HomeProps) {
        super(props);
        this.state = {
            videos: [],
            select: -1,
        };
    }

    loadVideo = async () => {
        axios({
            url: api_address,
            method: 'GET',
        }).then((response : any) => {
            let videoData = response.data.result;
            var videos : video[] = [{
                id: -1,
                url: "눌러서 선택해주세요~~",
            }];
            for (let video of videoData) {
                videos.push({
                    id: video.video_id, 
                    url: video.video_url
                });
            }
            this.setState({
                ...this.state,
                videos: videos,
            });
        });
    }

    componentDidMount() {
        this.loadVideo();
    }

    onVideoSelect = (event : any) => {
        this.setState({
            ...this.state,
            select: event.target.value,
        });
        console.log(event.target.value);
    }

    render() {
        let options = this.state.videos.map(({id, url}, key) => (<option value={id} key={key}>{url}</option>));
        return (
            <div>
                <select onChange = { this.onVideoSelect }>
                    { options }
                </select>
                <Link to={"/" + (this.state.select === -1 ? "" : this.state.select)}>
                    <button>
                        Pose estimation.. 해볼래?
                    </button>
                </Link>
            </div>
        );
    }
};

export default Home;