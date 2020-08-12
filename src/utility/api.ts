// @ts-ignore
import axios from 'axios';
import {
  ExerciseData,
  APIPostExerciseForm,
  APIGetUserInfoData,
} from 'utility/types';
import { SET_USER, CLEAR_USER } from 'actions/ActionTypes';
import store from 'store';

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
  thumb_url?: string;
  video_url?: string;
  skeleton?: string;
  reward: number;
  like_counts: number;
  view_counts: number;
  status: string;
  created_at: string;
  updated_at: string;
  isLike?: boolean;
}

export const getExercises = async () => {
  const token = await getAccessToken();

  const response = await axios.get(`${apiAddress}/exercises/`, token ? {
    headers: {
      'x-access-token': token,
    },
  } : {} );
  return (response.data.result as RawAPIExerciseData[]).map(processRawExerciseData);
};

export const getExercise = async (id: number) => {
  const token = await getAccessToken();

  const response = await axios.get(`${apiAddress}/exercises/${id}`, token ? {
    headers: {
      'x-access-token': token,
    },
  } : {});
  return processRawExerciseData(response.data.result as RawAPIExerciseData);
};

export const deleteExercise = async (id : number) => {  
  const token = await getAccessToken();
  if (!token) return null;

  const response = await axios.delete(`${apiAddress}/exercises/${id}`, {
    headers: {
      'x-access-token': token,
    }
  });
  return response.data.code == 200;
};

export const postResult = async (id : number, score : number, playTime : number, calorie : number) => {
  const token = await getAccessToken();
  if (!token) return null;

  const response = await axios.post(
    `${apiAddress}/exercises/${id}/history`,
    {
      score: score,
      play_time: secondToString(playTime),
      cal: calorie,
    },
    {
      headers: {
        'x-access-token': token,
      },
    }
  );

  if (response.data.code != 200) {
    throw new Error(
      '아직 Post를 실패했을 때 어떻게 할 지는 생각 안 해 봤습니다...'
    );
  }
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
  const token = await getAccessToken();
  if (!token) return null;

  const response = await axios({
    method: like ? 'POST' : 'DELETE',
    url: `${apiAddress}/likes/${id}`,
    headers: {
      'x-access-token': token,
    },
  });

  try {
    return response.data.code == 200;
  } catch {
    return false;
  }
};

export const login = async (
  id: number,
  profileImageUrl: string,
  accessToken: string,
) => {
  const response = await axios.post(`${apiAddress}/users`, {
    id: id,
    profile_image_url: profileImageUrl,
    access_token: accessToken,
  });

  if (response.data.code == 200 || response.data.code == 201) {
    const token = response.data.jwt;
    setAccessToken(token);
    const userInfo = await getUserInfo();
    
    store.dispatch({
      type: SET_USER,
      userInfo: userInfo,
    });
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem('token');
  store.dispatch({
    type: CLEAR_USER,
  });
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

  const response = await axios.get(`${apiAddress}/users`, {
    headers: {
      'x-access-token': token,
    },
  });

  if (response.data.code == 200) {
    return response.data.result as APIGetUserInfoData;
  }
};

export const postUserInfo = async (
  nickname: string,
  gender: string,
  height: number,
  weight: number
) => {
  const token = await getAccessToken();
  if (!token) return null;

  const response = await axios.post(
    `${apiAddress}/users/info`,
    {
      nickname: nickname,
      gender: gender,
      weight: weight,
      height: height,
    },
    {
      headers: {
        'x-access-token': token,
      },
    }
  );

  return response.data.code == 200;
};

export const getLikes = async () => {
  const token = await getAccessToken();
  if (!token) return null;

  const response = await axios.get(`${apiAddress}/likes`, {
    headers: {
      'x-access-token': token,
    },
  });

  if (response.data.code == 200)
    return (response.data.result as RawAPIExerciseData[]).map(processRawExerciseData);
};

export const getChannel = async (nickname : string) => {
  const response = await axios.get(`${apiAddress}/channel?nickname=${nickname}`);

  return (response.data.result as RawAPIExerciseData[]).map(processRawExerciseData);
}

export const toggleSubscribe = async (id : number, subscribe : boolean) => {
  const token = await getAccessToken();
  if (!token) return null;
 
  const response = await axios({
    method: subscribe ? 'POST' : 'DELETE',
    url: `${apiAddress}/channel/${id}`,
    headers: {
      'x-access-token': token,
    },
  });

  return response.data.code == 200;
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