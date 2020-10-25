// @ts-ignore
import axios, { AxiosRequestConfig } from 'axios';
import {
  ContentData,
  APIPostExerciseForm,
  APIGetUserInfoData,
  Channel,
  APIPostCourseForm,
  TagData,
} from 'utility/types';
import { SET_USER, CLEAR_USER, SUBSCRIBE } from 'actions/ActionTypes';
import store from 'store';
import { UserAction, setUser, subscribe, clearUser, raiseError, changeInfo, setResult } from 'actions';
import Axios from 'axios';
import { RawAPIExerciseData, processRawExerciseData, RawAPICourseData, processRawCourseData, RawAPIRecordData, RawAPITagData, processRawTagData, processRawRecordData } from './apiTypes';

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


// 현재 postExercise, login, getAccessToken를 제외한 모든 api 호출이 callAxios를 거쳐서 이루어지고 있음.
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
    return [response.data.code, response.data.result];
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

  if (code < 300) return result.map(processRawExerciseData);
  else return null;
};

export const getExercise = async (id: number) => {
  const [code, result] = await callAxios<RawAPIExerciseData>({
    method: 'GET',
    url: `${apiAddress}/exercises/${id}`,
  }, "sometimes");

  if (code < 300) return processRawExerciseData(result);
  else return null;
};

export const getCourses = async () => {
  const [code, result] = await callAxios<RawAPICourseData[]>({
    method: 'GET',
    url: `${apiAddress}/courses`,
  }, "sometimes");

  if (code < 300) return result.map(processRawCourseData);
  else return null;
}

export const getCourse = async (id: number) => {
  const [code, result] = await callAxios<RawAPICourseData>({
    method: 'GET',
    url: `${apiAddress}/courses/${id}`,
  }, "sometimes");

  if (code < 300) return processRawCourseData(result);
  else return null;
}

export const deleteExercise = async (id : number) => {  
  await callAxios<void>({
    method: 'DELETE',
    url: `${apiAddress}/exercises/${id}`,
  }, 'always');
};

export const getRecords = async () => {
  const [code, result] = await callAxios<RawAPIRecordData[]>({
    method: 'GET',
    url: `${apiAddress}/exercises_history`,
  }, 'always');

  if (code < 300) return result.map(processRawRecordData);
  else return null;
}

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

export const postCourse = async (data: APIPostCourseForm) => {
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

  const response = await fetch(`${apiAddress}/courses`, requestOptions);

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
  const response = await axios.post(`${apiAddress}/users`, {
    id: id,
    profile_image_url: profileImageUrl,
    access_token: accessToken,
  });

  if (response.data.code == 200 || response.data.code == 201) {
    const token = response.data.jwt;
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

  store.dispatch(changeInfo(nickname, gender, height, weight));
};

export const getLikes = async () => {
  let [code, result] = await callAxios<RawAPIExerciseData[]>({
    url: `${apiAddress}/likes`
  }, 'always');


  return (await Promise.all(result.map((content) => getExercise(content.exercise_id)))).filter((content) => content != null);
//  return result.map(processRawExerciseData);
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
  }, 'always', 'ignore');

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
  }, 'sometimes');

  return result.isLike === 1;
}

export const getId = async (name: string) => {
  let [code, result] = await callAxios<{user_id: number}>({
    method: 'GET',
    url: `${apiAddress}/users/id?nickname=${name}`,
  });

  return result.user_id;
}

export const searchContent = async (query : string) => {
  let result = await Axios({
    method: 'GET',
    url: `${apiAddress}/all/search?title=${query}`,
  });

  if (result.data.code < 300) return {
    exerciseResult: result.data.exerciseResult.map((result : RawAPIExerciseData) => processRawExerciseData(result) ) as ContentData[], 
    courseResult: result.data.courseResult.map((result : RawAPICourseData) => processRawCourseData(result) ) as ContentData[],
  };
  else return {
    exerciseResult: [], 
    courseResult: [],
  }
}


export const searchTag = async (tag : string) => {
  let result = await Axios({
    method: 'GET',
    url: `${apiAddress}/tags/search?tag_name=${tag}`,
  });

  if (result.data.code < 300) return {
    exerciseResult: result.data.exerciseResult.map((result : RawAPIExerciseData) => processRawExerciseData(result) ) as ContentData[], 
    courseResult: result.data.courseResult.map((result : RawAPICourseData) => processRawCourseData(result) ) as ContentData[],
  };
  else return {
    exerciseResult: [], 
    courseResult: [],
  }
}

export const getTags = async () => {
  let [code, result] = await callAxios<RawAPITagData[]>({
    method: 'GET',
    url: `${apiAddress}/tags`,
  });

  return result.map((rawData) => processRawTagData(rawData));
}
