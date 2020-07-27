
// @ts-ignore
import axios from 'axios';
import { assert } from 'console';

const apiAddress = 'https://api.maesil.ai';

export type APIDataExercise = {
    exercise_id: number,
    title: string,
    description: string,
    play_time: string,
    user_id: number,
    thumb_url?: string,
    video_url?: string,
    reward: number,
    like_counts: number,
    view_counts: number,
    status: string,
    created_at: string,
    updated_at: string,
};

/**
 * 초 단위로 나타낸 정수 시간을 string으로 변환하는 함수
 * @param {number} 시간 (초 단위)
 * @return {string} 시간을 DB가 읽을 수 있는 string으로 변환
 */
function secondToString(time : number) {
    assert(0 <= time && time < 100*60*60);

    const sec = time % 60; time = (time - sec) / 60;
    const min = time % 60; time = (time - min) / 60;
    const hr = time;

    return `${hr}:${min}:${sec}`;
}

export let getExercises = async () => {
    let response = await axios.get(`${apiAddress}/exercises/`);
    return response.data.result as APIDataExercise[];
}

export let getExercise = async (id : number) => {
    const response = await axios.get(`${apiAddress}/exercises/${id}`);
    return response.data.result as APIDataExercise;
}

export let postResult = async (score : number, playTime : number, calorie : number) => {
    const response = await axios.post(`${apiAddress}/exercises/${this.state.id}/history`, {
        'score': score,
        'play_time': secondToString(playTime),
        'cal': calorie,
    });
    assert(response.data.code == 200, "아직 Post한 결과가 200이 아닐 때는 생각 안 해 봤습니다...");
}