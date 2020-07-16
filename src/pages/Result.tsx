import apiAddress from '../secret';

// @ts-ignore
import axios from 'axios';
import React from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Title from '../components/Title';
import StatView from '../components/StatView';

interface Stats {
    time: number,
    calorie: number,
    score: number,
};

interface ResultProps {
    exerciseId : number,
    location: any,
};

interface ResultState {
    loading : boolean,
    exerciseName? : string,
};

class Result extends React.Component<ResultProps, ResultState> {
    stats: Stats;

    constructor(props) {
        super(props);

        console.log(this.props);
        this.stats = {
            time: this.props.location.state.time,
            calorie: this.props.location.state.calorie,
            score: this.props.location.state.score,
        };

        this.state = {
            loading: true,
        };
    }

    componentDidMount = () => {
        axios({
            method: "GET",
            url: apiAddress + "/exercises/" + 1,
        }).then((response) => {
            let exerciseName = response.data.result.title;

            console.log(exerciseName);

            this.setState({
                ...this.state,
                loading: false,
                exerciseName: exerciseName,
            });
        }).catch((error) => {
            console.log('ㅋㅋ');
        });
    }

    render() {
        if (this.state.loading) {
            return (
                <div>
                    <Header/>
                    결과를 불러오는 중입니다...
                    <Footer/>
                </div>
            );
        } else {
            let stats = this.stats;
            if (!stats) {
                stats = {
                    time: 63,
                    calorie: 1021,
                    score: 0.5
                };
            }

            return (
                <div>
                    <Header/>
                    <Title title={ this.state.exerciseName + " 완료!" } />
                    <StatView time={ stats.time } calorie={ stats.calorie } score={ stats.score } />
                    다음 코스도 추천해 주자~
                    <Footer/>
                </div>
            );
        }
    }
};

export default Result;