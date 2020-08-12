import * as types from 'actions/ActionTypes';
import { APIGetUserInfoData, Channel } from 'utility/types';

export const setUser = (userInfo: APIGetUserInfoData, subscribes: Channel[]) => {
  return {
    type: types.SET_USER,
    userInfo: userInfo,
    subscribes: subscribes,
  };
}

export const clearUser = () => {
  return {
    type: types.CLEAR_USER,
  }
}

export const subscribe = (channel: Channel, ok: boolean) => {
  return {
    type: types.SUBSCRIBE,
    channel: channel,
    ok: ok,
  };
}

export type UserAction = 
  | ReturnType<typeof setUser>
  | ReturnType<typeof clearUser>
  | ReturnType<typeof subscribe>;
