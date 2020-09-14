import * as types from 'actions/ActionTypes';
import { APIGetUserInfoData, Channel, ContentData, PlayRecord, TagData } from 'utility/types';

export const raiseError = (message: string) => {
  return {
    type: types.RAISE_ERROR,
    message: message,
  };
};

export const closeError = () => {
  return {
    type: types.CLOSE_ERROR,
  };
}

export const setTags = (tags: TagData[]) => {
  return {
    type: types.SET_TAGS,
    tags: tags,
  }
}

export type SystemAction =
  | ReturnType<typeof raiseError>
  | ReturnType<typeof closeError>
  | ReturnType<typeof setTags>;



export const setUser = (userInfo: APIGetUserInfoData, subscribes: Channel[], profileImageUrl: string) => {
  return {
    type: types.SET_USER,
    userInfo: userInfo,
    subscribes: subscribes,
    profileImageUrl: profileImageUrl,
  };
};

export const clearUser = () => {
  return {
    type: types.CLEAR_USER,
  };
};

export const subscribe = (channel: Channel, ok: boolean) => {
  return {
    type: types.SUBSCRIBE,
    channel: channel,
    ok: ok,
  };
};

export const changeInfo = (name: string, sex: string, height: number, weight: number) => {
  return {
    type: types.CHANGE_INFO,
    name: name,
    sex: sex,
    height: height,
    weight: weight,
  };
}

export type UserAction = 
  | ReturnType<typeof setUser>
  | ReturnType<typeof clearUser>
  | ReturnType<typeof subscribe>
  | ReturnType<typeof changeInfo>;


export const setContent = (content: ContentData) => {
  return {
    type: types.SET_CONTENT,
    content: content,
  };
}

export const setResult = (record: PlayRecord) => {
  return {
    type: types.SET_RESULT,
    record: record,
  };
};

export const clearContent = () => {
  return {
    type: types.CLEAR_CONTENT,
  };
};

export type ContentAction =
  | ReturnType<typeof setContent>
  | ReturnType<typeof setResult>
  | ReturnType<typeof clearContent>;