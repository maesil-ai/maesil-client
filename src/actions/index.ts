import * as types from 'actions/ActionTypes';
import { APIGetUserInfoData, Channel, ContentData, PlayRecord, TagData } from 'utility/types';

export const raiseError = (message: string) => {
  return {
    type: types.RAISE_ERROR,
    message,
  };
};

export const closeError = () => {
  return {
    type: types.CLOSE_ERROR,
  };
}

export const setTutorialStep = (step: number) => {
  return {
    type: types.SET_TUTORIAL_STEP,
    step,
  };
}

export const setTagsData = (tagsData: TagData[]) => {
  return {
    type: types.SET_TAGS_DATA,
    tagsData,
  }
}

export type SystemAction =
  | ReturnType<typeof raiseError>
  | ReturnType<typeof closeError>
  | ReturnType<typeof setTutorialStep>
  | ReturnType<typeof setTagsData>
  ;



export const setUser = (userInfo: APIGetUserInfoData, subscribes: Channel[], profileImageUrl: string) => {
  return {
    type: types.SET_USER,
    userInfo,
    subscribes,
    profileImageUrl,
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
    channel,
    ok,
  };
};

export const changeInfo = (name: string, sex: string, height: number, weight: number) => {
  return {
    type: types.CHANGE_INFO,
    name,
    sex,
    height,
    weight,
  };
}

export type UserAction = 
  | ReturnType<typeof setUser>
  | ReturnType<typeof clearUser>
  | ReturnType<typeof subscribe>
  | ReturnType<typeof changeInfo>
  ;


export const setContent = (content: ContentData) => {
  return {
    type: types.SET_CONTENT,
    content,
  };
}

export const setStream = (stream: MediaStream) => {
  return {
    type: types.SET_STREAM,
    stream,
  };
}

export const setResult = (record: PlayRecord) => {
  return {
    type: types.SET_RESULT,
    record,
  };
};

export const clearContent = () => {
  return {
    type: types.CLEAR_CONTENT,
  };
};

export type ContentAction =
  | ReturnType<typeof setContent>
  | ReturnType<typeof setStream>
  | ReturnType<typeof setResult>
  | ReturnType<typeof clearContent>
  ;