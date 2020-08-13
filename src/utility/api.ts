// @ts-ignore
import axios, { AxiosRequestConfig } from 'axios';
import {
  ExerciseData,
  APIPostExerciseForm,
  APIGetUserInfoData,
  Channel,
} from 'utility/types';
import { SET_USER, CLEAR_USER, SUBSCRIBE } from 'actions/ActionTypes';
import store from 'store';
import { UserAction, setUser, subscribe, clearUser, raiseError } from 'actions';

const apiAddress = 'https://api.maesil.ai';

function secondToString(time: number) {
  time = Math.round(time);
  if (!(0 <= time && time < 100 * 60 * 60)) {
    throw new Error('시간은 0초에서 360000초 사이여야 합니다.');
  }

  const sec = time % 60;
  time = (time - sec) / 60;
  const min = time % 60;
  time = (time - min) / 60;
  const hr = time;

  return `${hr}:${min}:${sec}`;
}

export interface RawAPIExerciseData {
  exercise_id: number;
  title: string;
  description: string;
  play_time: string;
  user_id: number;
  "user.nickname": string;
  thumb_url: string;
  thumb_gif_url: string;
  video_url: string;
  skeleton: string;
  reward: number;
  like_counts: number;
  view_counts: number;
  status: string;
  created_at: string;
  updated_at: string;
  isLike?: boolean;
}

// 현재 postExercise를 제외한 모든 api 호출이 callAxios를 거쳐서 이루어지고 있음.
// useToken = 'always': api 호출하기 전 access token을 무조건 가져와서 헤더에 넣음. 없으면 null 반환
// useToken = 'sometimes': api 호출하기 전 access token이 있으면 가져와서 헤더에 넣음. 없으면 말고 ㅋ
async function callAxios<Type> (config: AxiosRequestConfig, useToken : "never" | "always" | "sometimes" = "never", ifError : "abort" | "ignore" = "abort") : Promise<[number, Type]> {
  const token = useToken != 'never' && await getAccessToken();
  if (useToken === 'always' && !token) {
    if (ifError == 'abort') store.dispatch(raiseError(
      `로그인해야만 받아올 수 있는 정보를 로그인하지 않고 받아오려 했습니다. 받아오려던 정보: ${config.url}`
    ));
    return [null, null];
  }

  if (token) {
    Object.assign(config, {
      headers: {
        ...config.headers,
        'x-access-token': token,
      },
    })
  }
  
  try {
    let response = await axios(config);
    return [response.data.code, response.data.result as Type];
  } catch (error) {
    if (ifError == 'abort') store.dispatch(raiseError(
      `API 서버에서 정보를 받아오는 데에 문제가 생겼습니다. 받아오려던 정보 : ${config.url} 발생한 오류 : ${error}`
    ));
    return [null, null];
  }
}

export const getExercises = async () => {
  const [code, result] = await callAxios<RawAPIExerciseData[]>({
    method: 'GET',
    url: `${apiAddress}/exercises/`,
  }, "sometimes");

  return result.map(processRawExerciseData);
};

export const getExercise = async (id: number) => {
  const [code, result] = await callAxios<RawAPIExerciseData>({
    method: 'GET',
    url: `${apiAddress}/exercises/${id}`,
  }, "sometimes");

  return processRawExerciseData(result);
};

export const deleteExercise = async (id : number) => {  
  await callAxios<void>({
    method: 'DELETE',
    url: `${apiAddress}/exercises/${id}`,
  }, 'always');
};

export const postResult = async (id : number, score : number, playTime : number, calorie : number) => {
  await callAxios<void>({
    method: 'POST',
    url: `${apiAddress}/exercises/${id}/history`,
    data: {
      score: score,
      play_time: secondToString(playTime),
      cal: calorie,
    }
  }, 'always');
};

export const postExercise = async (data: APIPostExerciseForm) => {
  const token = await getAccessToken();
  if (!token) return null;

  const form = new FormData();

  for (const [key, value] of Object.entries(data)) {
    form.append(key, value);
  }

  const requestOptions = {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'x-access-token': token,
    },
    body: form,
    //    mode: "no-cors" as RequestMode,
    redirect: 'follow' as RequestRedirect,
  };

  const response = await fetch(`${apiAddress}/upload`, requestOptions);

  return response.status == 200;
};

export const toggleLike = async (id: number, like: boolean) => {
  await callAxios<void>({
    method: like ? 'POST' : 'DELETE',
    url: `${apiAddress}/likes/${id}`,
  }, 'always');
};

export const login = async (
  id: number,
  profileImageUrl: string,
  accessToken: string,
) => {
  let [code, data] = await callAxios<any>({
    method: 'POST',
    url: `${apiAddress}/users`,
    data: {
      id: id,
      profile_image_url: profileImageUrl,
      access_token: accessToken,
    }
  })

  if (code == 200 || code == 201) {
    const token = data.jwt;
    setAccessToken(token);
    const [userInfo, subscribes] = [await getUserInfo(), await getSubscribes()];
    
    store.dispatch(setUser(userInfo, subscribes, profileImageUrl));
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem('token');
  store.dispatch(clearUser());
};

export const getAccessToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) return token;

  try {
    await axios.get(`${apiAddress}/users`, {
      headers: {
        'x-access-token': token,
      },
    });
    return token;
  } catch (error) {
    logout();
    return null;
  }
};

export const setAccessToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const getUserInfo = async () => {
  const token = await getAccessToken();
  if (!token) return null;

  const [code, result] = await callAxios<APIGetUserInfoData>({
    method: 'get',
    url: `${apiAddress}/users`,
  }, 'always');
  
  return result;
};

export const postUserInfo = async (
  nickname: string,
  gender: string,
  height: number,
  weight: number
) => {
  const token = await getAccessToken();
  if (!token) return null;

  await callAxios({
    method: 'POST',
    url: `${apiAddress}/users/info`,
    data: {
      nickname: nickname,
      gender: gender,
      weight: weight,
      height: height,
    },
  }, 'always');
};

export const getLikes = async () => {
  let [code, result] = await callAxios<RawAPIExerciseData[]>({
    url: `${apiAddress}/likes`
  }, 'always');

  return result.map(processRawExerciseData);
};

export const getChannel = async (id: number) => {
  let [code, result] = await callAxios<RawAPIExerciseData[]>({
    method: 'GET',
    url: `${apiAddress}/channel/${id}`,
  });

  return result.map(processRawExerciseData);
}

export const toggleSubscribe = async (id : number, name : string, ok : boolean) => {
  let [code] = await callAxios({
    method: ok ? 'POST' : 'DELETE',
    url: `${apiAddress}/channel/${id}`,
  }, 'always');

  if (code == 200) {
    store.dispatch(subscribe({id: id, name: name}, ok));
  }
}

export const getSubscribes = async () => {
  const [code, result] = await callAxios<any[]>({
    method: 'GET',
    url: `${apiAddress}/users/subscribes`,
  }, 'always');

  return result.map((data) => {
    return {
      id: data.user_id,
      name: data.nickname,
    } as Channel;
  }) as Channel[];
}

export const getSubscribed = async (id : number) => {
  const [code, result] = await callAxios<any>({
    method: 'GET',
    url: `${apiAddress}/channel/${id}/subscribeInfo`
  }, 'always');

  return result.isLike === 1;
}

export const getId = async (name: string) => {
  let [code, result] = await callAxios<APIGetUserInfoData>({
    method: 'GET',
    url: `${apiAddress}/users/id?nickname=${name}`,
  });

  if (result == null) {
    store.dispatch(raiseError("존재하지 않는 유저를 검색하려 했습니다."));
    return null;
  }

  return result.user_id;
}

const processRawExerciseData = (rawData : RawAPIExerciseData) => {
  return {
      id: rawData.exercise_id,
      name: rawData.title,
      description: rawData.description,
      playTime: rawData.play_time,
      userId: rawData.user_id,
      userName: rawData["user.nickname"],
      thumbUrl: rawData.thumb_url,
      thumbGifUrl: rawData.thumb_gif_url,
      videoUrl: rawData.video_url,
      skeleton: rawData.skeleton,
      reward: rawData.reward,
      heartCount: rawData.like_counts,
      viewCount: rawData.view_counts,
      status: rawData.status,
      createdAt: rawData.created_at,
      updatedAt: rawData.updated_at,
      heart: rawData.isLike,
  } as ExerciseData;
}