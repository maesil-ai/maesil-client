import * as types from 'actions/ActionTypes';
import { APIGetUserInfoData, Channel } from 'utility/types';

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

export type SystemAction =
  | ReturnType<typeof raiseError>
  | ReturnType<typeof closeError>;


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

export type UserAction = 
  | ReturnType<typeof setUser>
  | ReturnType<typeof clearUser>
  | ReturnType<typeof subscribe>;
