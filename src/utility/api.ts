
// @ts-ignore
import axios from 'axios';
import { APIGetExerciseData, APIPostExerciseForm } from 'utility/types';

const apiAddress = 'https://api.maesil.ai';

/**
 * 초 단위로 나타낸 정수 시간을 string으로 변환하는 함수
 * @param {number} 시간 (초 단위)
 * @return {string} 시간을 DB가 읽을 수 있는 string으로 변환
 */
function secondToString(time : number) {
  time = Math.round(time);
  if (!(0 <= time && time < 100*60*60)) {
    throw new Error('시간은 0초에서 360000초 사이여야 합니다.');
  }

  const sec = time % 60; time = (time - sec) / 60;
  const min = time % 60; time = (time - min) / 60;
  const hr = time;

  return `${hr}:${min}:${sec}`;
}

export const getExercises = async () => {
  const response = await axios.get(`${apiAddress}/exercises/`);
  return response.data.result as APIGetExerciseData[];
};

export const getExercise = async (id : number) => {
  const response = await axios.get(`${apiAddress}/exercises/${id}`);
  return response.data.result as APIGetExerciseData;
};

export const postResult = async (id : number, score : number, playTime : number, calorie : number) => {
  const response = await axios.post(`${apiAddress}/exercises/${id}/history`, {
    'score': score,
    'play_time': secondToString(playTime),
    'cal': calorie,
  });

  if (response.data.code != 200) {
    throw new Error('아직 Post를 실패했을 때 어떻게 할 지는 생각 안 해 봤습니다...');
  }
};

export const postExercise = async (data : APIPostExerciseForm) => {
  const form = new FormData();

  for (let [key, value] of Object.entries(data)) {
    if (typeof value == 'number') {
      if (key == 'play_time') value = secondToString(value);
      else value = value.toString();
    }
    form.append(key, value);
  }

  const requestOptions = {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: form,
    //    mode: "no-cors" as RequestMode,
    redirect: 'follow' as RequestRedirect,
  };


  const response = await fetch('https://api.maesil.ai/upload', requestOptions);

  return response.status == 200;
};

export const toggleLike = async (id : number, like : boolean) => {
  console.log(id, like);
  const response = await axios({
    method: like ? "POST" : "DELETE",
    url: `${apiAddress}/likes/${id}`,
  });

  try {
    return response.data.code == 200;
  } catch {
    return false;
  }
}